import { useMemo, useState } from 'react'
import type { Group, User } from '../types'
import { useApp } from '../state/AppContext'
import { formatDuration, formatMonthLabel } from '../utils/date'
import { AllSessionsView } from './AllSessionsView'
import { Avatar } from './Avatar'
import { MonthCalendar } from './MonthCalendar'
import { Modal } from './Modal'

export function UserCalendarView({
  user,
  group,
  onClose,
}: {
  user: User
  group: Group
  onClose: () => void
}) {
  const { sessions } = useApp()
  const [showAll, setShowAll] = useState(false)
  const [now] = useState(() => new Date())

  const userGroupSessions = useMemo(
    () => sessions.filter((s) => s.userId === user.id && s.groupIds.includes(group.id)),
    [sessions, user.id, group.id],
  )

  const currentMonthSessions = useMemo(
    () =>
      userGroupSessions.filter((s) => {
        const created = new Date(s.createdAt)
        return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
      }),
    [userGroupSessions, now],
  )
  const currentMonthMinutes = currentMonthSessions.reduce((sum, s) => sum + s.durationMinutes, 0)

  return (
    <Modal title={showAll ? `Sessões de ${user.name}` : user.name} onClose={onClose}>
      {!showAll && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <Avatar user={user} size="lg" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{group.name}</p>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {formatDuration(currentMonthMinutes)} em {formatMonthLabel(now.getFullYear(), now.getMonth())}
              </p>
            </div>
          </div>
          {user.bio && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{user.bio}</p>}
        </div>
      )}

      {showAll ? (
        <AllSessionsView sessions={userGroupSessions} />
      ) : (
        <MonthCalendar year={now.getFullYear()} month={now.getMonth()} sessions={currentMonthSessions} />
      )}

      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        {showAll ? 'Voltar para o mês atual' : 'Ver todas as sessões'}
      </button>
    </Modal>
  )
}
