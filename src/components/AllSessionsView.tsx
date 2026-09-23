import type { StudySession } from '../types'
import { formatDuration, formatMonthLabel, groupSessionsByMonth } from '../utils/date'
import { MonthCalendar } from './MonthCalendar'

export function AllSessionsView({ sessions }: { sessions: StudySession[] }) {
  const months = groupSessionsByMonth(sessions)

  if (months.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">Nenhuma sessão registrada ainda.</p>
  }

  return (
    <div className="space-y-6">
      {months.map((bucket) => {
        const totalMinutes = bucket.sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
        return (
          <section key={bucket.key}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatMonthLabel(bucket.year, bucket.month)}
              </h3>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {formatDuration(totalMinutes)} no total
              </span>
            </div>
            <MonthCalendar year={bucket.year} month={bucket.month} sessions={bucket.sessions} />
          </section>
        )
      })}
    </div>
  )
}
