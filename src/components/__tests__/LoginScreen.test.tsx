import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signInWithPopup } from 'firebase/auth'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../state/AuthContext'
import { LoginScreen } from '../LoginScreen'

describe('LoginScreen', () => {
  it('mostra o botão de entrar com Google e aciona o login ao clicar', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Entrar com Google' }))

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled()
    })
  })
})
