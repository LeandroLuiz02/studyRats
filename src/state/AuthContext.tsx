import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth, db } from '../lib/firebase'

interface AuthContextValue {
  /** Usuário autenticado do Firebase, ou null se deslogado. */
  firebaseUser: FirebaseUser | null
  /** true enquanto o estado inicial de autenticação ainda está sendo verificado. */
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Cores de avatar disponíveis para novos usuários (mesma paleta do mockData). */
const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-fuchsia-500',
]

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Escolhe uma cor de avatar de forma determinística a partir do uid. */
function pickAvatarColor(uid: string): string {
  let hash = 0
  for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/**
 * Garante que existe um documento users/{uid} no Firestore, criando-o com os
 * dados do Google no primeiro login. Não sobrescreve um documento existente
 * (para não apagar bio/avatarUrl que o usuário já tenha configurado).
 */
async function ensureUserDoc(user: FirebaseUser): Promise<void> {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return

  await setDoc(ref, {
    name: user.displayName ?? 'Sem nome',
    initials: initialsFromName(user.displayName ?? '?'),
    avatarClass: pickAvatarColor(user.uid),
    createdAt: serverTimestamp(),
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        void ensureUserDoc(user).finally(() => {
          setFirebaseUser(user)
          setLoading(false)
        })
      } else {
        setFirebaseUser(null)
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOutUser = async () => {
    await firebaseSignOut(auth)
  }

  const value: AuthContextValue = { firebaseUser, loading, signInWithGoogle, signOutUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de <AuthProvider>')
  return ctx
}
