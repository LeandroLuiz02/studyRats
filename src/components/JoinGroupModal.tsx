import { useState } from 'react'
import type { Group } from '../types'
import { Modal } from './Modal'

export function JoinGroupModal({
  availableGroups,
  onClose,
  onJoinByCode,
  onJoinGroup,
}: {
  availableGroups: Group[]
  onClose: () => void
  onJoinByCode: (code: string) => Group | null
  onJoinGroup: (groupId: string) => void
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    const group = onJoinByCode(code)
    if (!group) {
      setError('Código inválido. Confira com quem te convidou.')
      return
    }
    setError(null)
    onClose()
  }

  return (
    <Modal title="Entrar em grupo" onClose={onClose}>
      <form onSubmit={handleSubmit} className="mb-5 space-y-2">
        <label htmlFor="invite-code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Código de convite
        </label>
        <div className="flex gap-2">
          <input
            id="invite-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: TRT2027"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Entrar
          </button>
        </div>
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      </form>

      {availableGroups.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Grupos disponíveis</h3>
          <ul className="space-y-2">
            {availableGroups.map((group) => (
              <li
                key={group.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{group.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{group.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onJoinGroup(group.id)
                    onClose()
                  }}
                  className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  Entrar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  )
}
