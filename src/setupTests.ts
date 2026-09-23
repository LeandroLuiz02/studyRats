import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { CURRENT_USER_ID, initialGroups, users as mockUsers } from './data/mockData'
import { mockFirebaseUser } from './test/mockFirebaseUser'

/**
 * O SDK do Firebase é mockado globalmente para todos os testes unitários/de
 * integração de componentes: eles não devem depender de rede real nem de
 * popups de login. Por padrão, simula:
 * - um usuário já autenticado (mockFirebaseUser);
 * - o perfil dele no Firestore espelhando o antigo usuário mock 'u1';
 * - a coleção "groups" com os grupos de exemplo (initialGroups) já existindo.
 * Isso é o suficiente pros testes existentes continuarem funcionando sem
 * reescrita pesada.
 *
 * Testes que precisam simular outro estado (deslogado, primeiro login, grupo
 * inexistente etc.) importam as funções mockadas de 'firebase/auth' ou
 * 'firebase/firestore' e usam vi.mocked(...).mockImplementationOnce(...) para
 * sobrescrever nesse teste.
 *
 * Testes de integração contra o Firebase de verdade (Firestore/Auth) usam o
 * Firebase Local Emulator Suite — ver docs/decisoes/0001-arquitetura-inicial.md.
 */
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(function GoogleAuthProvider(this: object) {
    return this
  }),
  onAuthStateChanged: vi.fn((_auth: unknown, callback: (user: unknown) => void) => {
    callback(mockFirebaseUser)
    return () => {}
  }),
  signInWithPopup: vi.fn(() => Promise.resolve({ user: mockFirebaseUser })),
  signOut: vi.fn(() => Promise.resolve()),
}))

const mockUserProfile = mockUsers.find((u) => u.id === CURRENT_USER_ID)!

/**
 * Referências mockadas de doc()/collection() carregam consigo o "caminho" (e um
 * id, para doc()), pra o mock de onSnapshot() saber que dado fake devolver pra
 * cada uma — igual ao SDK de verdade, sem precisar de rede.
 */
let mockDocIdCounter = 0

function mockDoc(...args: unknown[]) {
  const [first, ...rest] = args
  const parentPath =
    typeof first === 'object' && first !== null && 'path' in first ? String((first as { path: string }).path) : ''
  const segments = rest.filter((s): s is string => typeof s === 'string')

  if (segments.length > 0) {
    const path = [parentPath, ...segments].filter(Boolean).join('/')
    return { __kind: 'doc' as const, path, id: segments[segments.length - 1] }
  }

  // doc(collectionRef) sem segmentos adicionais: gera um id novo, como o SDK real.
  const id = `mock-id-${++mockDocIdCounter}`
  return { __kind: 'doc' as const, path: [parentPath, id].filter(Boolean).join('/'), id }
}

function mockCollection(_db: unknown, path: string) {
  return { __kind: 'collection' as const, path }
}

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(mockDoc),
  collection: vi.fn(mockCollection),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  arrayUnion: vi.fn((...items: unknown[]) => ({ __kind: 'arrayUnion' as const, items })),
  onSnapshot: vi.fn((ref: { __kind: 'doc' | 'collection'; path: string }, callback: (snap: unknown) => void) => {
    if (ref.__kind === 'doc' && ref.path === `users/${mockFirebaseUser.uid}`) {
      callback({
        exists: () => true,
        data: () => ({
          name: mockUserProfile.name,
          initials: mockUserProfile.initials,
          avatarClass: mockUserProfile.avatarClass,
          avatarUrl: mockUserProfile.avatarUrl,
          bio: mockUserProfile.bio,
        }),
      })
    } else if (ref.__kind === 'collection' && ref.path === 'groups') {
      callback({
        docs: initialGroups.map((g) => ({
          id: g.id,
          data: () => ({
            name: g.name,
            description: g.description,
            inviteCode: g.inviteCode,
            memberIds: g.memberIds,
          }),
        })),
      })
    } else {
      callback({ exists: () => false, data: () => undefined, docs: [] })
    }
    return () => {}
  }),
  serverTimestamp: vi.fn(() => null),
}))
