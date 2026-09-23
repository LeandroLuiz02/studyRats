import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CURRENT_USER_ID, initialSessions, users as mockUsers } from '../data/mockData'
import { db } from '../lib/firebase'
import type { Group, StudySession, User } from '../types'
import { useAuth } from './AuthContext'

interface PublishSessionInput {
  title: string
  description: string
  durationMinutes: number
  groupIds: string[]
}

interface UpdateProfileInput {
  bio?: string
  avatarUrl?: string
}

/** Formato do documento users/{uid} no Firestore (ver docs/decisoes/0002-integracao-firebase.md). */
interface FirestoreProfile {
  name: string
  initials: string
  avatarClass: string
  avatarUrl?: string
  bio?: string
}

interface AppContextValue {
  currentUser: User
  users: User[]
  groups: Group[]
  sessions: StudySession[]
  myGroups: Group[]
  availableGroups: Group[]
  createGroup: (name: string, description: string) => Group
  joinGroupByCode: (code: string) => Group | null
  joinGroup: (groupId: string) => void
  publishSession: (input: PublishSessionInput) => void
  updateProfile: (input: UpdateProfileInput) => void
  findUser: (userId: string) => User | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

let nextSessionId = 1000

/** Perfil de fallback (dados do mock) usado até o Firestore responder pela primeira vez. */
function fallbackProfile(): FirestoreProfile {
  const mock = mockUsers.find((u) => u.id === CURRENT_USER_ID)!
  return {
    name: mock.name,
    initials: mock.initials,
    avatarClass: mock.avatarClass,
    avatarUrl: mock.avatarUrl,
    bio: mock.bio,
  }
}

function groupFromDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Group {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    name: data.name,
    description: data.description,
    inviteCode: data.inviteCode,
    memberIds: data.memberIds ?? [],
  }
}

/**
 * AppProvider é normalmente montado só depois do portão de autenticação (ver
 * App.tsx), mas o próprio AuthContext resolve o usuário de forma assíncrona —
 * então, por uma fração de segundo (ou em testes que montam AppProvider sem
 * esperar o AuthContext assentar), firebaseUser ainda pode ser null. Nesse caso
 * não renderizamos nada, em vez de quebrar: os dados do app não fazem sentido
 * sem um usuário autenticado mesmo.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const { firebaseUser } = useAuth()
  if (!firebaseUser) return null
  return <AuthenticatedAppProvider firebaseUser={firebaseUser}>{children}</AuthenticatedAppProvider>
}

function AuthenticatedAppProvider({
  firebaseUser,
  children,
}: {
  firebaseUser: NonNullable<ReturnType<typeof useAuth>['firebaseUser']>
  children: ReactNode
}) {
  const uid = firebaseUser.uid

  // Sessões ainda são dados fake em memória (migração planejada para o próximo
  // passo — ver checklist na ADR 0002). Perfil e grupos já são reais, vindos do
  // Firestore.
  const [groups, setGroups] = useState<Group[]>([])
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions)
  const [profile, setProfile] = useState<FirestoreProfile | null>(null)

  useEffect(() => {
    const ref = doc(db, 'users', uid)
    return onSnapshot(ref, (snap) => {
      const data = snap.data() as FirestoreProfile | undefined
      if (data) setProfile(data)
    })
  }, [uid])

  useEffect(() => {
    const ref = collection(db, 'groups')
    return onSnapshot(ref, (snap) => {
      setGroups(snap.docs.map(groupFromDoc))
    })
  }, [])

  const users: User[] = useMemo(() => {
    const me: User = { id: uid, ...(profile ?? fallbackProfile()) }
    return mockUsers.map((u) => (u.id === CURRENT_USER_ID ? me : u))
  }, [profile, uid])

  const currentUser = users.find((u) => u.id === uid) ?? users[0]

  const myGroups = useMemo(
    () => groups.filter((g) => g.memberIds.includes(currentUser.id)),
    [groups, currentUser.id],
  )

  const availableGroups = useMemo(
    () => groups.filter((g) => !g.memberIds.includes(currentUser.id)),
    [groups, currentUser.id],
  )

  const createGroup = useCallback(
    (name: string, description: string) => {
      // Gera a referência (e o id) localmente, sem round-trip: permite navegar
      // pro grupo recém-criado na hora. A escrita em si acontece em segundo
      // plano; o onSnapshot acima confirma pra todo mundo (inclusive outras
      // abas/dispositivos) assim que o Firestore responder.
      const ref = doc(collection(db, 'groups'))
      const group: Group = {
        id: ref.id,
        name,
        description,
        inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        memberIds: [currentUser.id],
      }
      setGroups((prev) => [...prev, group])
      void setDoc(ref, {
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        memberIds: group.memberIds,
      })
      return group
    },
    [currentUser.id],
  )

  const joinGroup = useCallback(
    (groupId: string) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId && !g.memberIds.includes(currentUser.id)
            ? { ...g, memberIds: [...g.memberIds, currentUser.id] }
            : g,
        ),
      )

      const ref = doc(db, 'groups', groupId)
      void updateDoc(ref, { memberIds: arrayUnion(currentUser.id) })
    },
    [currentUser.id],
  )

  const joinGroupByCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase()
      const group = groups.find((g) => g.inviteCode.toUpperCase() === normalized)
      if (!group) return null
      joinGroup(group.id)
      return group
    },
    [groups, joinGroup],
  )

  const publishSession = useCallback(
    (input: PublishSessionInput) => {
      const session: StudySession = {
        id: `s${nextSessionId++}`,
        userId: currentUser.id,
        title: input.title,
        description: input.description,
        durationMinutes: input.durationMinutes,
        groupIds: input.groupIds,
        createdAt: new Date().toISOString(),
      }
      setSessions((prev) => [session, ...prev])
    },
    [currentUser.id],
  )

  const updateProfile = useCallback(
    (input: UpdateProfileInput) => {
      // Atualização otimista: a UI reflete a mudança na hora, sem esperar o
      // round-trip do Firestore. O onSnapshot acima mantém tudo sincronizado
      // depois (inclusive se o mesmo perfil for editado em outra aba/dispositivo).
      setProfile((prev) => ({ ...(prev ?? fallbackProfile()), ...input }))

      const ref = doc(db, 'users', uid)
      void setDoc(ref, input, { merge: true })
    },
    [uid],
  )

  const findUser = useCallback((userId: string) => users.find((u) => u.id === userId), [users])

  const value: AppContextValue = {
    currentUser,
    users,
    groups,
    sessions,
    myGroups,
    availableGroups,
    createGroup,
    joinGroupByCode,
    joinGroup,
    publishSession,
    updateProfile,
    findUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp precisa ser usado dentro de <AppProvider>')
  return ctx
}
