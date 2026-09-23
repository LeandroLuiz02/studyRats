import { useRef, useState } from 'react'
import { useApp } from '../state/AppContext'
import { Avatar } from './Avatar'
import { Modal } from './Modal'

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const { currentUser, updateProfile } = useApp()
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl)
  const [bio, setBio] = useState(currentUser.bio ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({ avatarUrl, bio: bio.trim() })
    onClose()
  }

  const previewUser = { ...currentUser, avatarUrl }

  return (
    <Modal title="Editar perfil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar user={previewUser} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Alterar foto
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl(undefined)}
                  className="text-sm text-slate-400 hover:text-rose-600"
                >
                  Remover
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="mt-1 text-xs text-slate-400">JPG ou PNG. Fica salva só neste dispositivo por enquanto.</p>
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
