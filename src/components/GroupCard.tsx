import type { Group, User } from '../types'
import { Avatar } from './Avatar'

export function GroupCard({
  group,
  members,
  onClick,
  actionLabel,
  onAction,
}: {
  group: Group
  members: User[]
  onClick?: () => void
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-500' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">{group.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{group.description}</p>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAction()
            }}
            className="shrink-0 rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {actionLabel}
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex -space-x-2">
          {members.slice(0, 5).map((m) => (
            <div key={m.id} className="rounded-full ring-2 ring-white dark:ring-slate-800">
              <Avatar user={m} size="sm" />
            </div>
          ))}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {members.length} {members.length === 1 ? 'membro' : 'membros'}
        </span>
      </div>
    </div>
  )
}
