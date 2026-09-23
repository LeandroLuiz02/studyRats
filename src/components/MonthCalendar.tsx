import { useState } from 'react'
import type { StudySession } from '../types'
import {
  WEEKDAY_LABELS,
  dateKey,
  formatDuration,
  getMonthMatrix,
  sumMinutesByDay,
} from '../utils/date'

export function MonthCalendar({ year, month, sessions }: { year: number; month: number; sessions: StudySession[] }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const weeks = getMonthMatrix(year, month)
  const minutesByDay = sumMinutesByDay(sessions)
  const sessionsByDay = new Map<string, StudySession[]>()
  for (const session of sessions) {
    const key = dateKey(new Date(session.createdAt))
    const list = sessionsByDay.get(key)
    if (list) list.push(session)
    else sessionsByDay.set(key, [session])
  }

  const selectedSessions = selectedDay ? (sessionsByDay.get(selectedDay) ?? []) : []

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i}>{label}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flat().map((day) => {
          const minutes = minutesByDay.get(day.key) ?? 0
          const hasStudy = minutes > 0
          const isSelected = selectedDay === day.key
          return (
            <button
              key={day.key}
              type="button"
              disabled={!hasStudy}
              onClick={() => setSelectedDay(isSelected ? null : day.key)}
              title={hasStudy ? `${formatDuration(minutes)} estudados` : undefined}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-xs transition ${
                !day.inCurrentMonth
                  ? 'text-slate-300 dark:text-slate-600'
                  : isSelected
                    ? 'bg-indigo-600 text-white'
                    : hasStudy
                      ? 'bg-indigo-100 font-semibold text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900'
                      : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <span>{day.date.getDate()}</span>
              {hasStudy && !isSelected && <span className="mt-0.5 h-1 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
            </button>
          )
        })}
      </div>

      {selectedDay && (
        <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
          {selectedSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate text-slate-700 dark:text-slate-200">{session.title}</span>
              <span className="shrink-0 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {formatDuration(session.durationMinutes)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
