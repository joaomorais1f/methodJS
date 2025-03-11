import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isToday,
  lastDayOfMonth,
  startOfMonth,
  startOfToday,
  startOfWeek,
  sub,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'

interface viewCalendarProps {
  viewCase: 'today' | 'week' | 'month'
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(startOfToday())
  const [view, setView] = useState('month')

  const startOfCurrentMonth = startOfMonth(currentDate)
  const endOfCurrentMonth = endOfMonth(currentDate)

  // Dias do mês atual
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  })

  // Semana do mês atual
  const weekCurrentMonth = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  })

  // dia da semana do dia atual
  const dayOfTheWeekToday = format(currentDate, 'EEEEEE', { locale: ptBR })

  // Dias do mês anterior
  const startDayOfWeek = getDay(startOfCurrentMonth) // 0 (Domingo) a 6 (Sábado)
  const previousMonth = sub(currentDate, { months: 1 })
  const lastDayOfPreviousMonth = lastDayOfMonth(previousMonth)
  const daysFromPreviousMonth = Array.from(
    { length: startDayOfWeek },
    (_, index) =>
      sub(lastDayOfPreviousMonth, { days: startDayOfWeek - index - 1 }),
  )

  // Dias do próximo mês
  const nextMonth = add(currentDate, { months: 1 })
  const daysToFillNextMonth = 7 - ((daysInMonth.length + startDayOfWeek) % 7)
  const daysFromNextMonth =
    daysToFillNextMonth < 7
      ? Array.from({ length: daysToFillNextMonth }, (_, index) =>
          add(endOfCurrentMonth, { days: index + 1 }),
        )
      : []

  function switchViewCalendar({ viewCase }: viewCalendarProps) {
    setView(viewCase)
  }

  function handleDayClick(day: Date) {
    // Atualiza para o mês anterior se o dia for do mês anterior
    if (day < startOfCurrentMonth) {
      setCurrentDate(previousMonth)
    }
    // Atualiza para o próximo mês se o dia for do próximo mês
    else if (day > endOfCurrentMonth) {
      setCurrentDate(nextMonth)
    }
  }

  function nextMonthHandler() {
    setCurrentDate(nextMonth)
  }

  function prevMonthHandler() {
    setCurrentDate(previousMonth)
  }

  return (
    <section>
      <header className="mt-3 flex flex-col">
        <div className="flex items-center justify-between pr-3">
          <h1 className="text-foreground text-2xl font-bold capitalize">
            {format(currentDate, 'MMMM', { locale: ptBR })}
          </h1>
          <div className="flex gap-3">
            <Button onClick={prevMonthHandler} className="cursor-pointer">
              <ChevronLeft />
            </Button>
            <Button onClick={nextMonthHandler} className="cursor-pointer">
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-3 mb-3 grid grid-cols-3 gap-2 pr-3 pl-3">
          <Button
            variant={view === 'today' ? 'secondary' : 'default'}
            onClick={() => switchViewCalendar({ viewCase: 'today' })}
          >
            Hoje
          </Button>
          <Button
            variant={view === 'week' ? 'secondary' : 'default'}
            onClick={() => switchViewCalendar({ viewCase: 'week' })}
          >
            Semana
          </Button>
          <Button
            variant={view === 'month' ? 'secondary' : 'default'}
            onClick={() => switchViewCalendar({ viewCase: 'month' })}
          >
            Mês
          </Button>
        </div>
      </header>
      {view !== 'today' && (
        <div className="text-muted-foreground mt-3 grid grid-cols-7 text-center">
          <span>DOM</span>
          <span>SEG</span>
          <span>TER</span>
          <span>QUA</span>
          <span>QUI</span>
          <span>SEX</span>
          <span>SÁB</span>
        </div>
      )}
      {view === 'month' && (
        <div className="grid grid-cols-7 gap-1">
          {/* Dias do mês anterior */}
          {daysFromPreviousMonth.map((day) => (
            <Button
              key={day.toString()}
              variant="outline"
              onClick={() => handleDayClick(day)}
              className="text-muted-foreground"
            >
              {format(day, 'd')}
            </Button>
          ))}

          {/* Dias do mês atual */}
          {daysInMonth.map((day) => (
            <Button
              key={day.toString()}
              variant="outline"
              onClick={() => handleDayClick(day)}
              className={`${isToday(day) ? 'border border-blue-600 text-blue-600' : ''}`}
            >
              {format(day, 'd')}
            </Button>
          ))}

          {/* Dias do próximo mês */}
          {daysFromNextMonth.map((day) => (
            <Button
              key={day.toString()}
              variant="outline"
              onClick={() => handleDayClick(day)}
              className="text-muted-foreground"
            >
              {format(day, 'd')}
            </Button>
          ))}
        </div>
      )}
      {view === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekCurrentMonth.map((day) => (
            <Button
              key={day.toString()}
              variant="outline"
              onClick={() => handleDayClick(day)}
              className={`${isToday(day) ? 'border border-blue-600 text-blue-600' : ''}`}
            >
              {format(day, 'd')}
            </Button>
          ))}
        </div>
      )}
      {view === 'today' && (
        <>
          <header className="text-muted-foreground mt-3 grid text-center">
            <span className="uppercase"> {dayOfTheWeekToday} </span>
            <span>
              {' '}
              {format(currentDate, "d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </header>
          <div />
        </>
      )}
    </section>
  )
}
