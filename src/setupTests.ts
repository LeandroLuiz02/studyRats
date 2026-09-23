import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { mockFirebaseUser } from './test/mockFirebaseUser'

/**
 * O SDK do Firebase é mockado globalmente para todos os testes unitários/de
 * integração de componentes: eles não devem depender de rede real nem de
 * popups de login. Por padrão, simula um usuário já autenticado (mockFirebaseUser),
 * para que os testes existentes (que não são sobre autenticação) continuem
 * funcionando sem precisar passar pela tela de login.
 *
 * Testes que precisam simular outro estado (deslogado, primeiro login, etc.)
 * importam as funções mockadas de 'firebase/auth'/'firebase/firestore' e usam
 * vi.mocked(...).mockImplementationOnce(...) para sobrescrever nesse teste.
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

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => null),
}))
