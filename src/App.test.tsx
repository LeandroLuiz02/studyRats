import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('fluxo completo: criar grupo, publicar sessão e ver no feed', () => {
  it('permite criar um grupo, publicar uma sessão nele e vê-la no feed do grupo', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Cria um novo grupo a partir da Home.
    await user.click(await screen.findByRole('button', { name: '+ Criar grupo' }))
    await user.type(screen.getByLabelText('Nome do grupo'), 'Grupo de Teste')
    await user.click(screen.getByRole('button', { name: 'Criar grupo' }))

    // Deve navegar automaticamente para dentro do grupo recém-criado.
    expect(await screen.findByRole('heading', { name: 'Grupo de Teste' })).toBeInTheDocument()

    // Publica uma sessão de estudo já com o grupo atual pré-selecionado.
    await user.click(screen.getByRole('button', { name: 'Publicar sessão de estudo' }))
    await user.type(screen.getByLabelText('Título'), 'Minha sessão de teste')

    const groupCheckbox = screen.getByLabelText('Grupo de Teste') as HTMLInputElement
    expect(groupCheckbox.checked).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    // A sessão publicada deve aparecer no Feed, agrupada em "Hoje".
    expect(await screen.findByText('Minha sessão de teste')).toBeInTheDocument()
    expect(screen.getByText('Hoje')).toBeInTheDocument()
  })

  it('mostra o usuário atual no ranking do grupo após publicar uma sessão', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('button', { name: '+ Criar grupo' }))
    await user.type(screen.getByLabelText('Nome do grupo'), 'Grupo Ranking')
    await user.click(screen.getByRole('button', { name: 'Criar grupo' }))
    await screen.findByRole('heading', { name: 'Grupo Ranking' })

    await user.click(screen.getByRole('button', { name: 'Publicar sessão de estudo' }))
    await user.type(screen.getByLabelText('Título'), 'Sessão para ranking')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))
    await screen.findByText('Sessão para ranking')

    await user.click(screen.getByRole('button', { name: 'Ranking' }))

    expect(await screen.findByText('Leandro Luiz')).toBeInTheDocument()
    expect(screen.getByText('(você)')).toBeInTheDocument()
  })
})
