import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CURRENT_USER_ID, initialGroups, initialSessions, users as initialUsers } from '../data/mockData'
import type { Group, StudySession, User } from '../types'

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

let nextGroupId = 1000
let nextSessionId = 1000

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions)

  const currentUser = users.find((u) => u.id === CURRENT_USER_ID) ?? users[0]

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
      const group: Group = {
        id: `g${nextGroupId++}`,
        name,
        description,
        inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        memberIds: [currentUser.id],
      }
      setGroups((prev) => [...prev, group])
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
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, ...input } : u)),
      )
    },
    [currentUser.id],
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
