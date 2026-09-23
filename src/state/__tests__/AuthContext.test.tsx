import { render, screen, waitFor } from '@testing-library/react'
import { getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { describe, expect, it, vi } from 'vitest'
import { mockFirebaseUser } from '../../test/mockFirebaseUser'
import { AuthProvider, useAuth } from '../AuthContext'

/** Componente simples que expõe o estado de useAuth() para os testes lerem. */
function AuthProbe() {
  const { firebaseUser, loading } = useAuth()
  if (loading) return <p>carregando</p>
  return <p>{firebaseUser ? `logado: ${firebaseUser.uid}` : 'deslogado'}</p>
}

describe('AuthContext', () => {
  it('expõe o usuário autenticado por padrão (mock global de firebase/auth)', async () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    expect(await screen.findByText(`logado: ${mockFirebaseUser.uid}`)).toBeInTheDocument()
  })

  it('expõe firebaseUser=null quando onAuthStateChanged reporta deslogado', async () => {
    vi.mocked(onAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      // @ts-expect-error mock simplificado só para este teste
      callback(null)
      return () => {}
    })

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    expect(await screen.findByText('deslogado')).toBeInTheDocument()
  })

  it('cria o documento users/{uid} no primeiro login (quando ainda não existe)', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({ exists: () => false } as never)

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: mockFirebaseUser.displayName,
          initials: 'UT',
        }),
      )
    })
  })

  it('não sobrescreve o documento do usuário quando ele já existe', async () => {
    // getDoc já mocka exists: () => true por padrão (ver setupTests.ts)
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    await screen.findByText(`logado: ${mockFirebaseUser.uid}`)
    expect(setDoc).not.toHaveBeenCalled()
  })

  it('chama signInWithPopup do Firebase ao entrar com Google', async () => {
    function Trigger() {
      const { signInWithGoogle } = useAuth()
      return (
        <button type="button" onClick={() => void signInWithGoogle()}>
          entrar
        </button>
      )
    }

    render(
      <AuthProvider>
        <Trigger />
      </AuthProvider>,
    )

    screen.getByText('entrar').click()

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled()
    })
  })
})
