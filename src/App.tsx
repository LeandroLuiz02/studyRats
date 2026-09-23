import { useState } from 'react'
import { GroupDetail } from './components/GroupDetail'
import { GroupList } from './components/GroupList'
import { Header } from './components/Header'
import { LoginScreen } from './components/LoginScreen'
import { ProfileButton } from './components/ProfileButton'
import { ThemeToggle } from './components/ThemeToggle'
import { AppProvider } from './state/AppContext'
import { AuthProvider, useAuth } from './state/AuthContext'
import { ThemeProvider } from './state/ThemeContext'

function Screens() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const { signOutUser } = useAuth()

  if (selectedGroupId) {
    return <GroupDetail groupId={selectedGroupId} onBack={() => setSelectedGroupId(null)} />
  }

  return (
    <div className="min-h-screen pb-20">
      <Header
        title="StudyRats"
        right={
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <ProfileButton />
            <button
              type="button"
              onClick={() => {
                void signOutUser()
              }}
              className="rounded-full px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Sair
            </button>
          </div>
        }
      />
      <GroupList onOpenGroup={setSelectedGroupId} />
    </div>
  )
}

/** Decide entre carregando / tela de login / app, com base no estado de autenticação. */
function AuthGate() {
  const { firebaseUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Carregando…
      </div>
    )
  }

  if (!firebaseUser) {
    return <LoginScreen />
  }

  return (
    <AppProvider>
      <div className="mx-auto min-h-screen max-w-md bg-slate-100 shadow-xl dark:bg-slate-900 sm:my-4 sm:min-h-0 sm:overflow-hidden sm:rounded-3xl">
        <Screens />
      </div>
    </AppProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  )
}
