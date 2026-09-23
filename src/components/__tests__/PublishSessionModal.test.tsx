import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { AppProvider, useApp } from '../../state/AppContext'
import { AuthProvider } from '../../state/AuthContext'
import { PublishSessionModal } from '../PublishSessionModal'

function renderModal(preselectedGroupId?: string) {
  const onClose = () => {}
  render(
    <AuthProvider>
      <AppProvider>
        <PublishSessionModal onClose={onClose} preselectedGroupId={preselectedGroupId} />
      </AppProvider>
    </AuthProvider>,
  )
}

/** Entra no grupo informado antes de montar o modal (preselectedGroupId só faz
 * sentido pra grupos dos quais o usuário atual já é membro — assim como no app
 * de verdade, onde essa tela só é aberta a partir de dentro de um grupo). */
function JoinGroupThenPublish({ groupId }: { groupId: string }) {
  const { joinGroup } = useApp()
  useEffect(() => {
    joinGroup(groupId)
  }, [groupId, joinGroup])
  return <PublishSessionModal onClose={() => {}} preselectedGroupId={groupId} />
}

describe('PublishSessionModal', () => {
  it('exige ao menos um grupo selecionado antes de publicar', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(await screen.findByLabelText('Título'), 'Sessão de teste')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(
      await screen.findByText('Escolha ao menos um grupo para publicar essa sessão.'),
    ).toBeInTheDocument()
  })

  it('pré-seleciona o grupo informado por preselectedGroupId', async () => {
    render(
      <AuthProvider>
        <AppProvider>
          <JoinGroupThenPublish groupId="g1" />
        </AppProvider>
      </AuthProvider>,
    )

    const checkbox = (await screen.findByLabelText('Concurso TRT 2027')) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })
})
