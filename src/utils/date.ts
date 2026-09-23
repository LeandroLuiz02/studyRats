import type { Group, StudySession, User } from '../types'

/** Chave estável 'YYYY-MM-DD' em fuso local, usada para agrupar por dia. */
export function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b)
}

/** Rótulo de data ao estilo do Gymrats: "Hoje", "Ontem" ou a data por extenso. */
export function relativeDateLabel(date: Date, now: Date = new Date()): string {
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  if (target.getTime() === today.getTime()) return 'Hoje'
  if (target.getTime() === yesterday.getTime()) return 'Ontem'

  const sameYear = target.getFullYear() === today.getFullYear()
  return capitalize(
    date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: sameYear ? undefined : 'numeric',
    }),
  )
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatMonthLabel(year: number, month: number): string {
  const date = new Date(year, month, 1)
  return capitalize(date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}h${String(rest).padStart(2, '0')}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export interface DateGroup {
  key: string
  label: string
  sessions: StudySession[]
}

/** Agrupa sessões por dia, mais recente primeiro, cada grupo ordenado por horário. */
export function groupSessionsByDate(sessions: StudySession[], now: Date = new Date()): DateGroup[] {
  const map = new Map<string, StudySession[]>()
  for (const session of sessions) {
    const created = new Date(session.createdAt)
    const key = dateKey(created)
    const list = map.get(key)
    if (list) list.push(session)
    else map.set(key, [session])
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, list]) => ({
      key,
      label: relativeDateLabel(new Date(list[0].createdAt), now),
      sessions: [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }))
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export interface CalendarDay {
  date: Date
  key: string
  inCurrentMonth: boolean
}

/** Matriz de semanas (domingo a sábado) cobrindo o mês inteiro, ao estilo calendário. */
export function getMonthMatrix(year: number, month: number): CalendarDay[][] {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  const weeks: CalendarDay[][] = []
  const cursor = new Date(gridStart)
  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = []
    for (let day = 0; day < 7; day++) {
      days.push({
        date: new Date(cursor),
        key: dateKey(cursor),
        inCurrentMonth: cursor.getMonth() === month,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(days)
    // Evita semana extra quando o mês termina exatamente no fim da 5ª semana.
    if (cursor.getMonth() !== month && cursor > firstOfMonth) break
  }
  return weeks
}

export { WEEKDAY_LABELS }

/** Soma minutos estudados por dia (chave 'YYYY-MM-DD') a partir de uma lista de sessões. */
export function sumMinutesByDay(sessions: StudySession[]): Map<string, number> {
  const totals = new Map<string, number>()
  for (const session of sessions) {
    const key = dateKey(new Date(session.createdAt))
    totals.set(key, (totals.get(key) ?? 0) + session.durationMinutes)
  }
  return totals
}

export interface MonthBucket {
  year: number
  month: number
  key: string
  sessions: StudySession[]
}

/** Agrupa as sessões de um usuário por mês, do mais recente para o mais antigo. */
export function groupSessionsByMonth(sessions: StudySession[]): MonthBucket[] {
  const map = new Map<string, MonthBucket>()
  for (const session of sessions) {
    const created = new Date(session.createdAt)
    const year = created.getFullYear()
    const month = created.getMonth()
    const key = monthKey(year, month)
    const bucket = map.get(key)
    if (bucket) bucket.sessions.push(session)
    else map.set(key, { year, month, key, sessions: [session] })
  }
  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1))
}

export interface RankingEntry {
  user: User
  totalMinutes: number
  sessionCount: number
}

/**
 * Ranking dos membros de um grupo no mês de referência (por padrão, o mês atual),
 * ordenado do maior para o menor tempo estudado.
 */
export function rankGroupMembers(
  group: Group,
  users: User[],
  sessions: StudySession[],
  referenceDate: Date = new Date(),
): RankingEntry[] {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()

  const entries: RankingEntry[] = group.memberIds
    .map((userId) => users.find((u) => u.id === userId))
    .filter((u): u is User => Boolean(u))
    .map((user) => {
      const userSessions = sessions.filter((s) => {
        if (s.userId !== user.id || !s.groupIds.includes(group.id)) return false
        const created = new Date(s.createdAt)
        return created.getFullYear() === year && created.getMonth() === month
      })
      const totalMinutes = userSessions.reduce((sum, s) => sum + s.durationMinutes, 0)
      return { user, totalMinutes, sessionCount: userSessions.length }
    })

  return entries.sort((a, b) => b.totalMinutes - a.totalMinutes)
}
