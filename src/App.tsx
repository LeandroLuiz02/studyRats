import { useState } from 'react'
import { GroupDetail } from './components/GroupDetail'
import { GroupList } from './components/GroupList'
import { Header } from './components/Header'
import { ProfileButton } from './components/ProfileButton'
import { ThemeToggle } from './components/ThemeToggle'
import { AppProvider } from './state/AppContext'
import { ThemeProvider } from './state/ThemeContext'

function Screens() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

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
          </div>
        }
      />
      <GroupList onOpenGroup={setSelectedGroupId} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="mx-auto min-h-screen max-w-md bg-slate-100 shadow-xl dark:bg-slate-900 sm:my-4 sm:min-h-0 sm:overflow-hidden sm:rounded-3xl">
          <Screens />
        </div>
      </AppProvider>
    </ThemeProvider>
  )
}
