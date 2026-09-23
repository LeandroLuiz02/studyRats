import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '../../state/ThemeContext'
import { ThemeToggle } from '../ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('alterna a classe "dark" no <html> ao clicar', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Ativar modo escuro' }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Ativar modo claro' }))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persiste a preferência em localStorage', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Ativar modo escuro' }))
    expect(localStorage.getItem('studyrats-theme')).toBe('dark')
  })
})
