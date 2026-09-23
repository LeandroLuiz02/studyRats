import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { Modal } from './Modal'

const DURATION_PRESETS = [15, 30, 45, 60, 90]

export function PublishSessionModal({
  onClose,
  preselectedGroupId,
}: {
  onClose: () => void
  preselectedGroupId?: string
}) {
  const { myGroups, publishSession } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(30)
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    preselectedGroupId ? [preselectedGroupId] : [],
  )
  const [error, setError] = useState<string | null>(null)

  function toggleGroup(groupId: string) {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || duration <= 0) return
    if (selectedGroupIds.length === 0) {
      setError('Escolha ao menos um grupo para publicar essa sessão.')
      return
    }
    publishSession({
      title: title.trim(),
      description: description.trim(),
      durationMinutes: duration,
      groupIds: selectedGroupIds,
    })
    onClose()
  }

  return (
    <Modal title="Publicar sessão de estudo" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="session-title" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Título
          </label>
          <input
            id="session-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Direito Constitucional - Controle de Constitucionalidade"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        <div>
          <label htmlFor="session-description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Descrição
          </label>
          <textarea
            id="session-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="O que você estudou?"
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>

        <div>
          <label htmlFor="session-duration" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Duração (minutos)
          </label>
          <input
            id="session-duration"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDuration(preset)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  duration === preset
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {preset}min
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Publicar em quais grupos?</span>
          <div className="space-y-2">
            {myGroups.map((group) => (
              <label
                key={group.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={selectedGroupIds.includes(group.id)}
                  onChange={() => toggleGroup(group.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {group.name}
              </label>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Publicar
        </button>
      </form>
    </Modal>
  )
}
