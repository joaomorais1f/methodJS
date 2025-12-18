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
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { api, type Review } from '@/lib/api'

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  // Carrega revisões quando a data é selecionada
  useEffect(() => {
    if (selectedDate && isDialogOpen) {
      loadReviews()
    }
  }, [selectedDate, isDialogOpen])

  async function loadReviews() {
    if (!selectedDate) return

    setIsLoadingReviews(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const data = await api.getReviewsByDate(dateStr)
      setReviews(data)
    } catch (error) {
      console.error('Erro ao carregar revisões:', error)
      toast.error('Erro ao carregar revisões')
    } finally {
      setIsLoadingReviews(false)
    }
  }

  async function handleMarkAsReviewed(contentId: number, reviewType: string) {
    try {
      const result = await api.markReviewCompleted(
        contentId,
        reviewType as 'next_day' | 'one_week' | 'one_month' | 'three_months',
      )

      if (result?.success) {
        toast.success('Revisão marcada como completa!')
        loadReviews()
      } else {
        toast.error(result?.error || 'Erro ao marcar revisão')
      }
    } catch (error) {
      console.error('Erro ao marcar revisão:', error)
      toast.error('Erro ao marcar revisão')
    }
  }

  async function handleUnmarkReview(contentId: number, reviewType: string) {
    try {
      const result = await api.unmarkReviewCompleted(
        contentId,
        reviewType as 'next_day' | 'one_week' | 'one_month' | 'three_months',
      )

      if (result?.success) {
        toast.success('Revisão desmarcada com sucesso!')
        loadReviews()
      } else {
        toast.error(result?.error || 'Erro ao desmarcar revisão')
      }
    } catch (error) {
      console.error('Erro ao desmarcar revisão:', error)
      toast.error('Erro ao desmarcar revisão')
    }
  }

  function handleDayClick(day: Date) {
    setSelectedDate(day)
    setIsDialogOpen(true)
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
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
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
            className='cursor-pointer'
          >
            Hoje
          </Button>
          <Button
            variant={view === 'week' ? 'secondary' : 'default'}
            onClick={() => switchViewCalendar({ viewCase: 'week' })}
            className='cursor-pointer'
          >
            Semana
          </Button>
          <Button
            variant={view === 'month' ? 'secondary' : 'default'}
            onClick={() => switchViewCalendar({ viewCase: 'month' })}
            className='cursor-pointer'
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? format(selectedDate, "d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
                : 'Selecione uma data'}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4">
                {isLoadingReviews ? (
                  <p className="text-center text-muted-foreground">
                    Carregando revisões...
                  </p>
                ) : reviews.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Nenhuma revisão pendente para esta data.
                  </p>
                ) : (
                  <ul className="flex list-inside list-none flex-col gap-3">
                    {reviews.map((review) => (
                      <li
                        key={`${review.content_id}-${review.review_type}`}
                        className="flex flex-col gap-2 rounded-md border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded px-2 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: review.label_color }}
                          >
                            {review.label_name}
                          </span>
                          <span className="flex-1 font-medium">
                            {review.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">
                            {review.review_type === 'next_day' && 'Dia seguinte'}
                            {review.review_type === 'one_week' && '1 semana'}
                            {review.review_type === 'one_month' && '1 mês'}
                            {review.review_type === 'three_months' &&
                              '3 meses'}
                          </span>
                          <span>•</span>
                          <span>
                            {review.scheduled_date.split('-').reverse().join('/')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {!review.completed ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleMarkAsReviewed(
                                  review.content_id,
                                  review.review_type,
                                )
                              }
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="size-4" />
                              Marcar como revisado
                            </Button>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-green-600">
                                ✓ Revisado em{' '}
                                {review.completed_at &&
                                  format(
                                    new Date(review.completed_at),
                                    "dd/MM/yyyy 'às' HH:mm",
                                  )}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUnmarkReview(
                                    review.content_id,
                                    review.review_type,
                                  )
                                }
                                className="flex items-center gap-1 cursor-pointer"
                              >
                                <X className="size-4" />
                                Desmarcar
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                  className={`cursor-pointer ${
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
                  className="text-muted-foreground cursor-pointer"
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
                  className={`cursor-pointer ${
                    isToday(day) ? 'border border-blue-600 text-blue-600' : ''
                  }`}
                >
                  {format(day, 'd')}
                </Button>
              </DialogTrigger>
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
      </Dialog>
    </section>
  )
}
