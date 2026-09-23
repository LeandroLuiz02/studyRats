import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppProvider, useApp } from '../../state/AppContext'
import { AuthProvider } from '../../state/AuthContext'
import { ProfileModal } from '../ProfileModal'

function Wrapper({ onClose }: { onClose: () => void }) {
  return (
    <AuthProvider>
      <AppProvider>
        <ProfileModal onClose={onClose} />
      </AppProvider>
    </AuthProvider>
  )
}

function CurrentBio() {
  const { currentUser } = useApp()
  return <p data-testid="current-bio">{currentUser.bio}</p>
}

describe('ProfileModal', () => {
  it('pré-preenche o campo "Sobre" com a bio atual do usuário', async () => {
    render(<Wrapper onClose={() => {}} />)
    const textarea = (await screen.findByLabelText('Sobre')) as HTMLTextAreaElement
    expect(textarea.value).toContain('TRT')
  })

  it('salva a nova bio e fecha o modal', async () => {
    const user = userEvent.setup()
    let closed = false

    render(
      <AuthProvider>
        <AppProvider>
          <ProfileModal onClose={() => (closed = true)} />
          <CurrentBio />
        </AppProvider>
      </AuthProvider>,
    )

    const textarea = await screen.findByLabelText('Sobre')
    await user.clear(textarea)
    await user.type(textarea, 'Focado em redação essa semana.')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(closed).toBe(true)
    expect(await screen.findByTestId('current-bio')).toHaveTextContent('Focado em redação essa semana.')
  })
})
