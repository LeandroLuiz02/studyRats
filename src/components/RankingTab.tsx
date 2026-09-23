import { useState } from 'react'
import { useApp } from '../state/AppContext'
import type { Group, User } from '../types'
import { formatMonthLabel, rankGroupMembers } from '../utils/date'
import { RankingRow } from './RankingRow'
import { UserCalendarView } from './UserCalendarView'

export function RankingTab({ group }: { group: Group }) {
  const { users, sessions, currentUser } = useApp()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const now = new Date()
  const ranking = rankGroupMembers(group, users, sessions, now)

  return (
    <div className="p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        Ranking de {formatMonthLabel(now.getFullYear(), now.getMonth())}
      </h2>

      {ranking.length === 0 ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">Este grupo ainda não tem membros.</p>
      ) : (
        <ul className="space-y-2">
          {ranking.map((entry, index) => (
            <li key={entry.user.id}>
              <RankingRow
                position={index + 1}
                entry={entry}
                isCurrentUser={entry.user.id === currentUser.id}
                onClick={() => setSelectedUser(entry.user)}
              />
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <UserCalendarView user={selectedUser} group={group} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
