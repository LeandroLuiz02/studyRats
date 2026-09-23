import { useTheme } from '../state/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      className="rounded-full p-2 text-lg leading-none hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
