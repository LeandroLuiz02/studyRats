import type { StudySession, User } from '../types'
import { formatDuration, formatTime } from '../utils/date'
import { Avatar } from './Avatar'

export function SessionCard({ session, user }: { session: StudySession; user: User }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start gap-3">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
            <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{formatTime(new Date(session.createdAt))}</span>
          </div>
          <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">{session.title}</p>
          {session.description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{session.description}</p>
          )}
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            ⏱ {formatDuration(session.durationMinutes)}
          </span>
        </div>
      </div>
    </div>
  )
}
