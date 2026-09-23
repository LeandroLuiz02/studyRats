import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppProvider } from '../../state/AppContext'
import { PublishSessionModal } from '../PublishSessionModal'

function renderModal(preselectedGroupId?: string) {
  const onClose = () => {}
  render(
    <AppProvider>
      <PublishSessionModal onClose={onClose} preselectedGroupId={preselectedGroupId} />
    </AppProvider>,
  )
}

describe('PublishSessionModal', () => {
  it('exige ao menos um grupo selecionado antes de publicar', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Título'), 'Sessão de teste')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(
      await screen.findByText('Escolha ao menos um grupo para publicar essa sessão.'),
    ).toBeInTheDocument()
  })

  it('pré-seleciona o grupo informado por preselectedGroupId', () => {
    renderModal('g1')
    const checkbox = screen.getByLabelText('Concurso TRT 2027') as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })
})
