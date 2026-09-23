import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { Avatar } from './Avatar'
import { Modal } from './Modal'

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const { currentUser, updateProfile } = useApp()
  const [bio, setBio] = useState(currentUser.bio ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({ bio: bio.trim() })
    onClose()
  }

  return (
    <Modal title="Editar perfil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar user={currentUser} size="lg" />
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{currentUser.name}</p>
            <p className="text-xs text-slate-400">
              Foto de perfil temporariamente indisponível (ver docs/decisoes/0002).
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nome
          </label>
          <input
            id="profile-name"
            value={currentUser.name}
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="profile-bio" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Sobre
          </label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre seus estudos e objetivos"
            rows={4}
            maxLength={280}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <p className="mt-1 text-right text-xs text-slate-400">{bio.length}/280</p>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Salvar
        </button>
      </form>
    </Modal>
  )
}
