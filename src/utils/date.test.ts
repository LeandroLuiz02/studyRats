import { describe, expect, it } from 'vitest'
import type { Group, StudySession, User } from '../types'
import {
  dateKey,
  formatDuration,
  formatMonthLabel,
  getMonthMatrix,
  groupSessionsByDate,
  groupSessionsByMonth,
  rankGroupMembers,
  relativeDateLabel,
  sumMinutesByDay,
} from './date'

describe('formatDuration', () => {
  it('mostra apenas minutos quando é menos de uma hora', () => {
    expect(formatDuration(45)).toBe('45min')
  })

  it('mostra horas cheias sem minutos quando é múltiplo de 60', () => {
    expect(formatDuration(120)).toBe('2h')
  })

  it('mostra horas e minutos combinados', () => {
    expect(formatDuration(95)).toBe('1h35')
  })
})

describe('relativeDateLabel', () => {
  const now = new Date(2026, 8, 23, 12, 0, 0) // 23 de setembro de 2026

  it('retorna "Hoje" para a data atual', () => {
    expect(relativeDateLabel(new Date(2026, 8, 23, 8, 0), now)).toBe('Hoje')
  })

  it('retorna "Ontem" para o dia anterior', () => {
    expect(relativeDateLabel(new Date(2026, 8, 22, 20, 0), now)).toBe('Ontem')
  })

  it('retorna a data por extenso para dias mais antigos', () => {
    const label = relativeDateLabel(new Date(2026, 8, 10, 9, 0), now)
    expect(label).toContain('10')
    expect(label.toLowerCase()).toContain('setembro')
  })
})

describe('groupSessionsByDate', () => {
  const now = new Date(2026, 8, 23, 12, 0, 0)
  const sessions: StudySession[] = [
    { id: '1', userId: 'u1', title: 'A', description: '', durationMinutes: 10, groupIds: ['g1'], createdAt: new Date(2026, 8, 23, 8).toISOString() },
    { id: '2', userId: 'u1', title: 'B', description: '', durationMinutes: 10, groupIds: ['g1'], createdAt: new Date(2026, 8, 23, 20).toISOString() },
    { id: '3', userId: 'u1', title: 'C', description: '', durationMinutes: 10, groupIds: ['g1'], createdAt: new Date(2026, 8, 22, 9).toISOString() },
  ]

  it('agrupa por dia e ordena do mais recente para o mais antigo', () => {
    const groups = groupSessionsByDate(sessions, now)
    expect(groups).toHaveLength(2)
    expect(groups[0].label).toBe('Hoje')
    expect(groups[0].sessions).toHaveLength(2)
    expect(groups[1].label).toBe('Ontem')
  })

  it('dentro de cada dia, ordena as sessões da mais recente para a mais antiga', () => {
    const groups = groupSessionsByDate(sessions, now)
    expect(groups[0].sessions[0].id).toBe('2')
    expect(groups[0].sessions[1].id).toBe('1')
  })
})

describe('getMonthMatrix', () => {
  it('cobre o mês inteiro em semanas de 7 dias, começando no domingo', () => {
    const weeks = getMonthMatrix(2026, 8) // setembro de 2026
    for (const week of weeks) {
      expect(week).toHaveLength(7)
      expect(week[0].date.getDay()).toBe(0)
    }
    const allDays = weeks.flat()
    const daysInMonth = allDays.filter((d) => d.inCurrentMonth)
    expect(daysInMonth).toHaveLength(30)
  })
})

describe('sumMinutesByDay', () => {
  it('soma os minutos de sessões no mesmo dia', () => {
    const sessions: StudySession[] = [
      { id: '1', userId: 'u1', title: 'A', description: '', durationMinutes: 30, groupIds: ['g1'], createdAt: new Date(2026, 8, 23, 8).toISOString() },
      { id: '2', userId: 'u1', title: 'B', description: '', durationMinutes: 20, groupIds: ['g1'], createdAt: new Date(2026, 8, 23, 20).toISOString() },
    ]
    const totals = sumMinutesByDay(sessions)
    expect(totals.get(dateKey(new Date(2026, 8, 23)))).toBe(50)
  })
})

describe('groupSessionsByMonth', () => {
  it('agrupa por mês do mais recente para o mais antigo', () => {
    const sessions: StudySession[] = [
      { id: '1', userId: 'u1', title: 'A', description: '', durationMinutes: 10, groupIds: ['g1'], createdAt: new Date(2026, 8, 5).toISOString() },
      { id: '2', userId: 'u1', title: 'B', description: '', durationMinutes: 10, groupIds: ['g1'], createdAt: new Date(2026, 6, 15).toISOString() },
    ]
    const months = groupSessionsByMonth(sessions)
    expect(months).toHaveLength(2)
    expect(months[0].month).toBe(8)
    expect(months[1].month).toBe(6)
  })
})

describe('formatMonthLabel', () => {
  it('formata mês e ano por extenso em português', () => {
    expect(formatMonthLabel(2026, 8).toLowerCase()).toContain('setembro')
    expect(formatMonthLabel(2026, 8)).toContain('2026')
  })
})

describe('rankGroupMembers', () => {
  const users: User[] = [
    { id: 'u1', name: 'Leandro', initials: 'L', avatarClass: '' },
    { id: 'u2', name: 'Ana', initials: 'A', avatarClass: '' },
  ]
  const group: Group = { id: 'g1', name: 'Grupo', description: '', inviteCode: 'X', memberIds: ['u1', 'u2'] }
  const now = new Date(2026, 8, 23)
  const sessions: StudySession[] = [
    { id: '1', userId: 'u1', title: 'A', description: '', durationMinutes: 30, groupIds: ['g1'], createdAt: new Date(2026, 8, 1).toISOString() },
    { id: '2', userId: 'u2', title: 'B', description: '', durationMinutes: 90, groupIds: ['g1'], createdAt: new Date(2026, 8, 2).toISOString() },
    // Sessão de outro mês não deve contar no ranking do mês atual.
    { id: '3', userId: 'u2', title: 'C', description: '', durationMinutes: 999, groupIds: ['g1'], createdAt: new Date(2026, 6, 2).toISOString() },
  ]

  it('ordena do maior para o menor tempo estudado no mês de referência', () => {
    const ranking = rankGroupMembers(group, users, sessions, now)
    expect(ranking[0].user.id).toBe('u2')
    expect(ranking[0].totalMinutes).toBe(90)
    expect(ranking[1].user.id).toBe('u1')
    expect(ranking[1].totalMinutes).toBe(30)
  })
})
