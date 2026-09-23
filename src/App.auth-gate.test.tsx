import { render, screen } from '@testing-library/react'
import { onAuthStateChanged } from 'firebase/auth'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App — portão de autenticação', () => {
  it('mostra a tela de login em vez do app quando o usuário está deslogado', async () => {
    vi.mocked(onAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      // @ts-expect-error mock simplificado só para este teste
      callback(null)
      return () => {}
    })

    render(<App />)

    expect(await screen.findByRole('button', { name: 'Entrar com Google' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '+ Criar grupo' })).not.toBeInTheDocument()
  })
})
