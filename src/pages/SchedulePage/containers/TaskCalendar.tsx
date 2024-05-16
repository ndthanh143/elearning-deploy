import { Calendar, Event, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import { useState } from 'react'
import { QuizDetailsModal } from '.'
import { QuizzesInfo } from '@/services/user/user.dto'

const localizer = dayjsLocalizer(dayjs)

interface ITaskCalendarProps {
  quizzes: QuizzesInfo[]
}

export const TaskCalendar = ({ quizzes }: ITaskCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs().toDate())

  const [selectedQuiz, setSelectedQuiz] = useState<Event | null>(null)

  const handleSelectEvent = (event: Event) => {
    setSelectedQuiz(event)
  }

  const handleCloseModal = () => setSelectedQuiz(null)

  const events = quizzes.map((quiz) => ({
    start: dayjs(quiz.quizInfo.startDate).toDate(),
    end: dayjs(quiz.quizInfo.endDate).toDate(),
    title: quiz.quizInfo.quizTitle,
    allDay: true,
  }))

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: '80vh' }}
        onNavigate={(date) => setCurrentDate(date)}
        date={currentDate}
        onView={() => {}}
        onSelectEvent={handleSelectEvent}
      />

      {selectedQuiz && <QuizDetailsModal quiz={selectedQuiz} open={!!selectedQuiz} onClose={handleCloseModal} />}
    </div>
  )
}
