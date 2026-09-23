import type { User } from '../types'

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
} as const

export function Avatar({ user, size = 'md' }: { user: User; size?: keyof typeof SIZES }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        title={user.name}
        className={`shrink-0 rounded-full object-cover ${SIZES[size]}`}
      />
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${user.avatarClass} ${SIZES[size]}`}
      title={user.name}
    >
      {user.initials}
    </div>
  )
}
