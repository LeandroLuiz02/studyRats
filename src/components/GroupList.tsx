import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { CreateGroupModal } from './CreateGroupModal'
import { GroupCard } from './GroupCard'
import { JoinGroupModal } from './JoinGroupModal'
import { PublishSessionModal } from './PublishSessionModal'

export function GroupList({ onOpenGroup }: { onOpenGroup: (groupId: string) => void }) {
  const { myGroups, availableGroups, users, createGroup, joinGroupByCode, joinGroup } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [showPublish, setShowPublish] = useState(false)

  function membersOf(memberIds: string[]) {
    return memberIds.map((id) => users.find((u) => u.id === id)).filter((u) => Boolean(u)) as typeof users
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Criar grupo
        </button>
        <button
          type="button"
          onClick={() => setShowJoin(true)}
          className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Entrar em grupo
        </button>
      </div>

      {myGroups.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Você ainda não faz parte de nenhum grupo. Crie um ou entre em um existente para começar a
          registrar suas sessões de estudo.
        </p>
      ) : (
        <ul className="space-y-3">
          {myGroups.map((group) => (
            <li key={group.id}>
              <GroupCard
                group={group}
                members={membersOf(group.memberIds)}
                onClick={() => onOpenGroup(group.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreate={(name, description) => {
            const group = createGroup(name, description)
            setShowCreate(false)
            onOpenGroup(group.id)
          }}
        />
      )}

      {showJoin && (
        <JoinGroupModal
          availableGroups={availableGroups}
          onClose={() => setShowJoin(false)}
          onJoinByCode={joinGroupByCode}
          onJoinGroup={joinGroup}
        />
      )}

      {myGroups.length > 0 && (
        <button
          type="button"
          onClick={() => setShowPublish(true)}
          aria-label="Publicar sessão de estudo"
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl font-light text-white shadow-lg hover:bg-indigo-700"
        >
          +
        </button>
      )}

      {showPublish && <PublishSessionModal onClose={() => setShowPublish(false)} />}
    </div>
  )
}
