import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  lastDayOfMonth,
  startOfMonth,
  startOfToday,
  sub,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(startOfToday())

  const startOfCurrentMonth = startOfMonth(currentDate)
  const endOfCurrentMonth = endOfMonth(currentDate)

  // Dias do mês atual
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  })

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

  function handleDayClick(day) {
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
        <div className="text-muted-foreground mt-3 grid grid-cols-7 text-center">
          <span>DOM</span>
          <span>SEG</span>
          <span>TER</span>
          <span>QUA</span>
          <span>QUI</span>
          <span>SEX</span>
          <span>SÁB</span>
        </div>
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
      </header>
    </section>
  )
}
