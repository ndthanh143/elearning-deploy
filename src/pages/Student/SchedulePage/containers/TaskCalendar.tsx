import { Calendar, Event, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import { useState } from 'react'
import { QuizDetailsModal } from '.'
import { QuizzesInfo } from '@/services/user/user.dto'
import { Chip, Stack } from '@mui/material'
import { Flex } from '@/components'
import { primary } from '@/styles/theme'

const localizer = dayjsLocalizer(dayjs)

interface ITaskCalendarProps {
  quizzes: QuizzesInfo[]
}

export const TaskCalendar = ({ quizzes }: ITaskCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs().toDate())

  const [selectedQuiz, setSelectedQuiz] = useState<Event | null>(null)

  const [filter, setFilter] = useState('week')

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

  const filterRange = [
    {
      label: 'Week',
      value: 'week',
    },
    {
      label: 'Month',
      value: 'month',
    },
    {
      label: 'Year',
      value: 'year',
    },
  ]

  return (
    <Stack gap={2}>
      <Flex gap={2}>
        {filterRange.map((range) => (
          <Chip
            key={range.value}
            label={range.label}
            onClick={() => setFilter(range.value)}
            sx={{
              px: 4,
              borderRadius: 3,
              color: filter === range.value ? 'primary.contrastText' : 'primary.main',
              fontWeight: 700,
              bgcolor: filter === range.value ? 'primary.main' : primary[100],
            }}
            color={filter === range.value ? 'primary' : 'default'}
          />
        ))}
      </Flex>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: '80vh', color: primary[500], backgroundColor: 'white' }}
        onNavigate={(date) => setCurrentDate(date)}
        date={currentDate}
        onView={() => {}}
        onSelectEvent={handleSelectEvent}
        className='custom-calendar'
      />

      {selectedQuiz && <QuizDetailsModal quiz={selectedQuiz} open={!!selectedQuiz} onClose={handleCloseModal} />}
    </Stack>
  )
}
