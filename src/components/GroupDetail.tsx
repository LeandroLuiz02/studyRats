import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { FeedTab } from './FeedTab'
import { Header } from './Header'
import { PublishSessionModal } from './PublishSessionModal'
import { RankingTab } from './RankingTab'
import { ThemeToggle } from './ThemeToggle'

type Tab = 'feed' | 'ranking'

export function GroupDetail({ groupId, onBack }: { groupId: string; onBack: () => void }) {
  const { groups } = useApp()
  const [tab, setTab] = useState<Tab>('feed')
  const [showPublish, setShowPublish] = useState(false)

  const group = groups.find((g) => g.id === groupId)
  if (!group) return null

  return (
    <div className="relative min-h-screen pb-20">
      <Header title={group.name} onBack={onBack} right={<ThemeToggle />} />

      <div className="flex border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {(['feed', 'ranking'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 border-b-2 py-3 text-sm font-semibold transition ${
              tab === t
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            {t === 'feed' ? 'Feed' : 'Ranking'}
          </button>
        ))}
      </div>

      {tab === 'feed' ? <FeedTab group={group} /> : <RankingTab group={group} />}

      <button
        type="button"
        onClick={() => setShowPublish(true)}
        aria-label="Publicar sessão de estudo"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl font-light text-white shadow-lg hover:bg-indigo-700"
      >
        +
      </button>

      {showPublish && (
        <PublishSessionModal onClose={() => setShowPublish(false)} preselectedGroupId={group.id} />
      )}
    </div>
  )
}
