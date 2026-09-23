import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StudySession, User } from '../../types'
import { SessionCard } from '../SessionCard'

const user: User = { id: 'u1', name: 'Leandro Luiz', initials: 'LL', avatarClass: 'bg-indigo-500' }

const session: StudySession = {
  id: 's1',
  userId: 'u1',
  title: 'Direito Constitucional',
  description: 'Revisão de jurisprudência',
  durationMinutes: 90,
  groupIds: ['g1'],
  createdAt: new Date(2026, 8, 23, 8, 30).toISOString(),
}

describe('SessionCard', () => {
  it('mostra nome do autor, título, descrição e duração formatada', () => {
    render(<SessionCard session={session} user={user} />)

    expect(screen.getByText('Leandro Luiz')).toBeInTheDocument()
    expect(screen.getByText('Direito Constitucional')).toBeInTheDocument()
    expect(screen.getByText('Revisão de jurisprudência')).toBeInTheDocument()
    expect(screen.getByText('⏱ 1h30')).toBeInTheDocument()
  })

  it('omite o parágrafo de descrição quando ela está vazia', () => {
    render(<SessionCard session={{ ...session, description: '' }} user={user} />)
    expect(screen.queryByText('Revisão de jurisprudência')).not.toBeInTheDocument()
  })
})
