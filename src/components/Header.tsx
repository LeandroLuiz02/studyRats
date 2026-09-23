import type { ReactNode } from 'react'

export function Header({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          ←
        </button>
      )}
      <h1 className="flex-1 truncate text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>
      {right}
    </header>
  )
}
