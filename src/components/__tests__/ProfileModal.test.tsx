import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppProvider, useApp } from '../../state/AppContext'
import { ProfileModal } from '../ProfileModal'

function Wrapper({ onClose }: { onClose: () => void }) {
  return (
    <AppProvider>
      <ProfileModal onClose={onClose} />
    </AppProvider>
  )
}

function CurrentBio() {
  const { currentUser } = useApp()
  return <p data-testid="current-bio">{currentUser.bio}</p>
}

describe('ProfileModal', () => {
  it('pré-preenche o campo "Sobre" com a bio atual do usuário', () => {
    render(<Wrapper onClose={() => {}} />)
    const textarea = screen.getByLabelText('Sobre') as HTMLTextAreaElement
    expect(textarea.value).toContain('TRT')
  })

  it('salva a nova bio e fecha o modal', async () => {
    const user = userEvent.setup()
    let closed = false

    render(
      <AppProvider>
        <ProfileModal onClose={() => (closed = true)} />
        <CurrentBio />
      </AppProvider>,
    )

    const textarea = screen.getByLabelText('Sobre')
    await user.clear(textarea)
    await user.type(textarea, 'Focado em redação essa semana.')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(closed).toBe(true)
    expect(await screen.findByTestId('current-bio')).toHaveTextContent('Focado em redação essa semana.')
  })
})
