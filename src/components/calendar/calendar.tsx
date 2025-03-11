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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

interface viewCalendarProps {
  viewCase: 'today' | 'week' | 'month'
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(startOfToday())
  const [view, setView] = useState('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null) // Para armazenar a data clicada

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
    setSelectedDate(day) // Define a data clicada
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
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? format(selectedDate, "d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
                : 'Selecione uma data'}
            </DialogTitle>
            <DialogDescription asChild>
              {/* Conteúdo simulando itens de estudo */}
              <ul className="flex list-inside list-none flex-col gap-1">
                <li className="flex gap-2">
                  <span className="border bg-yellow-600 text-white">
                    Matemática
                  </span>
                  <span className="ml-auto">Equação do 2º grau</span>
                </li>
                <li className="flex gap-2">
                  <span className="border bg-green-600 text-white">
                    Química
                  </span>
                  <span>Química Orgânica</span>
                </li>
                <li className="flex gap-2">
                  <span className="border bg-gray-600 text-white">
                    História
                  </span>
                  <span> Revolução Industrial </span>
                </li>
                <li className="flex gap-2">
                  <span className="border bg-orange-600 text-white">
                    Física
                  </span>
                  <span> Leis de Newton</span>
                </li>
                <li className="flex gap-2">
                  <span className="border bg-yellow-600 text-white">
                    Matemática
                  </span>
                  <span>Geometria Espacial</span>
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        {view === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Dias do mês anterior */}
            {daysFromPreviousMonth.map((day) => (
              <DialogTrigger asChild key={day.toString()}>
                <Button
                  variant="outline"
                  onClick={() => handleDayClick(day)}
                  className="text-muted-foreground"
                >
                  {format(day, 'd')}
                </Button>
              </DialogTrigger>
            ))}

            {/* Dias do mês atual */}
            {daysInMonth.map((day) => (
              <DialogTrigger asChild key={day.toString()}>
                <Button
                  variant="outline"
                  onClick={() => handleDayClick(day)}
                  className={`${
                    isToday(day) ? 'border border-blue-600 text-blue-600' : ''
                  }`}
                >
                  {format(day, 'd')}
                </Button>
              </DialogTrigger>
            ))}

            {/* Dias do próximo mês */}
            {daysFromNextMonth.map((day) => (
              <DialogTrigger asChild key={day.toString()}>
                <Button
                  variant="outline"
                  onClick={() => handleDayClick(day)}
                  className="text-muted-foreground"
                >
                  {format(day, 'd')}
                </Button>
              </DialogTrigger>
            ))}
          </div>
        )}
        {view === 'week' && (
          <div className="grid grid-cols-7 gap-2">
            {weekCurrentMonth.map((day) => (
              <DialogTrigger asChild key={day.toString()}>
                <Button
                  variant="outline"
                  onClick={() => handleDayClick(day)}
                  className={`${
                    isToday(day) ? 'border border-blue-600 text-blue-600' : ''
                  }`}
                >
                  {format(day, 'd')}
                </Button>
              </DialogTrigger>
            ))}
          </div>
        )}
      </Dialog>
    </section>
  )
}
