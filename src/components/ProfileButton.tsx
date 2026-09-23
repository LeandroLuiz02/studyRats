import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { Avatar } from './Avatar'
import { ProfileModal } from './ProfileModal'

export function ProfileButton() {
  const { currentUser } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Editar perfil"
        title="Editar perfil"
        className="rounded-full ring-offset-2 hover:ring-2 hover:ring-indigo-300 dark:ring-offset-slate-900"
      >
        <Avatar user={currentUser} size="sm" />
      </button>
      {open && <ProfileModal onClose={() => setOpen(false)} />}
    </>
  )
}
