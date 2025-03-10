import { add, format, startOfToday, sub } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(startOfToday())

  const currentMonth = format(currentDate, 'MMMM', {
    locale: ptBR,
  })

  function nextMonth() {
    setCurrentDate(add(currentDate, { months: 1 })) // Adiciona 1 mês à data atual
  }

  function prevMonth() {
    setCurrentDate(sub(currentDate, { months: 1 })) // Subtrai 1 mês da data atual
  }

  return (
    <section>
      <header className="mt-3 flex flex-col">
        <div className="flex items-center justify-between pr-3">
          <h1 className="text-foreground text-2xl font-bold capitalize">
            {currentMonth}
          </h1>
          <div className="flex gap-3">
            <Button onClick={prevMonth}>
              <ChevronLeft />
            </Button>
            <Button onClick={nextMonth}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </header>
    </section>
  )
}
