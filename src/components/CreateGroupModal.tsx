import { useState } from 'react'
import { Modal } from './Modal'

export function CreateGroupModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string, description: string) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const trimmedName = name.trim()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!trimmedName) return
    onCreate(trimmedName, description.trim())
  }

  return (
    <Modal title="Criar grupo" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="group-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nome do grupo
          </label>
          <input
            id="group-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Concurso TRT 2027"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>
        <div>
          <label htmlFor="group-description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Descrição
          </label>
          <textarea
            id="group-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Sobre o que é esse grupo de estudos?"
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={!trimmedName}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
        >
          Criar grupo
        </button>
      </form>
    </Modal>
  )
}
