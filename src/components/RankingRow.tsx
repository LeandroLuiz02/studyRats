import type { RankingEntry } from '../utils/date'
import { formatDuration } from '../utils/date'
import { Avatar } from './Avatar'

const MEDALS = ['🥇', '🥈', '🥉']

export function RankingRow({
  position,
  entry,
  isCurrentUser,
  onClick,
}: {
  position: number
  entry: RankingEntry
  isCurrentUser: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-500 ${
        isCurrentUser
          ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <span className="w-6 shrink-0 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        {MEDALS[position - 1] ?? position}
      </span>
      <Avatar user={entry.user} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {entry.user.name}
          {isCurrentUser && <span className="ml-1 text-xs font-normal text-indigo-500 dark:text-indigo-400">(você)</span>}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {entry.sessionCount} {entry.sessionCount === 1 ? 'sessão' : 'sessões'}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {formatDuration(entry.totalMinutes)}
      </span>
    </button>
  )
}
