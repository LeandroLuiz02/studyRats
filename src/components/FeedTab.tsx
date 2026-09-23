import { useApp } from '../state/AppContext'
import type { Group } from '../types'
import { groupSessionsByDate } from '../utils/date'
import { SessionCard } from './SessionCard'

export function FeedTab({ group }: { group: Group }) {
  const { sessions, findUser } = useApp()
  const groupSessions = sessions.filter((s) => s.groupIds.includes(group.id))
  const dateGroups = groupSessionsByDate(groupSessions)

  if (dateGroups.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Ninguém publicou sessões de estudo neste grupo ainda. Seja o primeiro!
      </p>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {dateGroups.map((dateGroup) => (
        <section key={dateGroup.key}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {dateGroup.label}
          </h2>
          <div className="space-y-3">
            {dateGroup.sessions.map((session) => {
              const user = findUser(session.userId)
              if (!user) return null
              return <SessionCard key={session.id} session={session} user={user} />
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
