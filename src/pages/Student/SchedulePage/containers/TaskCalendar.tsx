import { Calendar, Event, ToolbarProps, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import { ReactNode, useState } from 'react'
import { QuizDetailsModal } from '.'
import { Chip, Stack, Tooltip } from '@mui/material'
import { CustomSelect, Flex } from '@/components'
import { primary } from '@/styles/theme'
import { SkipNextRounded, SkipPreviousRounded } from '@mui/icons-material'
import { QuizSchedule } from '@/services/quiz/quiz.dto'
import { quizKey } from '@/services/quiz/quiz.query'
import { useQuery } from '@tanstack/react-query'
import { isArray } from 'lodash'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { AssignmentSchedule } from '@/services/assignment/assignment.dto'
import { icons } from '@/assets/icons'

const localizer = dayjsLocalizer(dayjs)

const CustomToolBar = ({ views, view, onView, onNavigate, label }: ToolbarProps<Event, object>) => {
  const filterProps: Record<keyof typeof views, string> = {
    week: 'Week',
    month: 'Month',
    day: 'Day',
    agenda: 'Agenda',
  }

  const actions: { label: string | ReactNode; value: string; onClick: () => void }[] = [
    {
      label: <SkipPreviousRounded />,
      value: 'back',
      onClick: () => onNavigate('PREV'),
    },
    {
      label: <SkipNextRounded />,
      value: 'Next',
      onClick: () => onNavigate('NEXT'),
    },
  ]

  return (
    <Flex justifyContent='space-between' mb={2} position='relative'>
      <CustomSelect
        value={view}
        data={(views as [keyof typeof views]).map((range: keyof typeof views) => ({
          label: filterProps[range],
          value: range,
        }))}
        sx={{ width: 150 }}
        size='small'
        onChange={(e) => onView(e.target.value as keyof typeof views)}
      />

      <Chip
        label={label}
        sx={{
          px: 4,
          borderRadius: 3,
          color: 'primary.main',
          fontWeight: 700,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
        variant='outlined'
        color={'primary'}
      />
      <Flex gap={2}>
        {actions.map((action) => (
          <Chip
            key={action.value}
            label={action.label}
            onClick={action.onClick}
            sx={{
              px: 4,
              borderRadius: 3,
              color: true ? 'primary.contrastText' : 'primary.main',
              fontWeight: 700,
              bgcolor: true ? 'primary.main' : primary[100],
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
            color={true ? 'primary' : 'default'}
          />
        ))}
      </Flex>
    </Flex>
  )
}

const eventTypeProps = {
  quiz: {
    icon: icons['quiz'],
  },
  assignment: {
    icon: icons['assignment'],
  },
}

export const TaskCalendar = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf('month').toDate().toISOString())
  const [endDate, setEndDate] = useState(dayjs().endOf('month').toDate().toISOString())

  const [currentDate, setCurrentDate] = useState(dayjs().toDate())

  const quizScheduleInstance = quizKey.schedule({ startDate, endDate })
  const { data: quizData } = useQuery({ ...quizScheduleInstance })

  const assignmentScheduleInstance = assignmentKeys.schedule({ startDate, endDate })
  const { data: assignmentData } = useQuery({ ...assignmentScheduleInstance })

  const [selectedQuiz, setSelectedQuiz] = useState<
    (Event & { type: 'assignment' | 'quiz'; data: QuizSchedule | AssignmentSchedule }) | null
  >(null)

  const handleSelectEvent = (
    event: Event & { type: 'quiz' | 'assignment'; data: QuizSchedule | AssignmentSchedule },
  ) => {
    setSelectedQuiz(event)
  }

  const handleCloseModal = () => setSelectedQuiz(null)

  const quizEvents =
    quizData?.map((quiz) => ({
      start: dayjs(quiz.startDate).toDate(),
      end: dayjs(quiz.endDate).toDate(),
      title: quiz.quizTitle,
      allDay: true,
      data: quiz,
      type: 'quiz',
    })) || []

  const assignmentEvents =
    assignmentData?.map((assignment) => ({
      start: dayjs(assignment.startDate).toDate(),
      end: dayjs(assignment.endDate).toDate(),
      title: assignment.assignmentTitle,
      allDay: true,
      data: assignment,
      type: 'assignment',
    })) || []

  const events = [...quizEvents, ...assignmentEvents]

  const eventStyleGetter = (
    event: Event & { type: 'assignment' | 'quiz'; data: QuizSchedule | AssignmentSchedule },
  ) => {
    let backgroundColor = primary[500]
    if (event.type === 'quiz') {
      backgroundColor = '#2196f3' // Red for expired quizzes, Blue for upcoming quizzes
    } else if (event.type === 'assignment') {
      backgroundColor = '#4caf50' // Red for expired assignments, Green for upcoming assignments
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '1px solid #ddd',
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        // textDecoration: event.status === 'expired' ? 'line-through' : 'none',
      },
    }
  }

  return (
    <Stack
      gap={2}
      sx={{
        '.rbc-time-view': {
          bgcolor: 'white',
          borderRadius: 3,
        },
        '.rbc-month-view': {
          bgcolor: 'white',
          borderRadius: 3,
        },

        '.rbc-event': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
          px: 3,
        },
        '.rbc-today': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Calendar
        localizer={localizer}
        events={
          events as Event &
            {
              type: 'assignment' | 'quiz'
              data: QuizSchedule | AssignmentSchedule
            }[]
        }
        startAccessor='start'
        endAccessor='end'
        style={{ height: '80vh', color: primary[500], backgroundColor: 'transparent' }}
        onNavigate={(date) => setCurrentDate(date)}
        date={currentDate}
        onSelectEvent={handleSelectEvent}
        className='custom-calendar'
        eventPropGetter={eventStyleGetter}
        onRangeChange={(range) => {
          if (isArray(range)) {
            setStartDate(range[0].toISOString())
            setEndDate(range[range.length - 1].toISOString())
          }
          if (
            typeof range == 'object' &&
            (range as { start: Date; end: Date }).start &&
            (range as { start: Date; end: Date }).end
          ) {
            setStartDate((range as { start: Date; end: Date }).start.toISOString())
            setEndDate((range as { start: Date; end: Date }).end.toISOString())
          }
        }}
        components={{
          event: ({ event }) => (
            <Tooltip title={event.title} arrow>
              <Flex sx={{ gap: 1 }}>
                <Flex bgcolor='white' borderRadius='100%'>
                  {eventTypeProps[event.type].icon}
                </Flex>
                <span>{event.title}</span>
              </Flex>
            </Tooltip>
          ),
          toolbar: CustomToolBar,
        }} // Use custom toolbar
      />

      {selectedQuiz && (
        <QuizDetailsModal
          event={selectedQuiz}
          open={!!selectedQuiz}
          onClose={handleCloseModal}
          data={selectedQuiz.data}
          type={selectedQuiz.type}
        />
      )}
    </Stack>
  )
}
