import { BoxContent, WeekPicker } from '@/components'
import { ArrowBack, ArrowForward, CalendarMonth } from '@mui/icons-material'
import { Box, Divider, IconButton, Menu, MenuItem, Select, Stack, Typography } from '@mui/material'
import { DateBox } from '../components'
import { useMenu } from '@/hooks'
import { getWeekDates } from '@/utils'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { QuizzesInfo } from '@/services/user/user.dto'
import { blue } from '@mui/material/colors'
import { gray } from '@/styles/theme'
import { useSearchParams } from 'react-router-dom'

const timestampsInADay = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

export type ScheduleBoardProps = { quizzes: QuizzesInfo[] }

export const ScheduleBoard = ({ quizzes }: ScheduleBoardProps) => {
  const { anchorEl, isOpen, onClose, onOpen: openWeekPicker } = useMenu()

  const [searchParams, _] = useSearchParams()

  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(searchParams.get('date') || new Date()))
  const [selectedDay, setSelectedDay] = useState<Dayjs>(dayjs(searchParams.get('date') || new Date()))

  const currentWeeks = getWeekDates(currentDate)

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(7, 'day'))
  }

  const handleNext = () => {
    setCurrentDate(currentDate.add(7, 'day'))
  }

  const filterQuizzes = quizzes.filter(
    (quiz) => dayjs(quiz.quizInfo.startDate).format('DD/MM/YYYY') === selectedDay.format('DD/MM/YYYY'),
  )

  useEffect(() => {
    setSelectedDay(dayjs(searchParams.get('date') || new Date()))
    setCurrentDate(dayjs(searchParams.get('date') || new Date()))
  }, [searchParams.get('date')])

  return (
    <BoxContent>
      <Stack gap={4}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Stack direction='row' alignItems='center' gap={2}>
            <Typography variant='h5'>{currentDate.format('MMMM YYYY')}</Typography>
            <IconButton sx={{ borderRadius: '50%' }} onClick={openWeekPicker}>
              <CalendarMonth />
            </IconButton>
            <Menu anchorEl={anchorEl} onClose={onClose} open={isOpen} sx={{}}>
              <BoxContent borderRadius={3}>
                <WeekPicker value={currentDate} onChange={(value) => value && setCurrentDate(value)} />
              </BoxContent>
            </Menu>
          </Stack>
          <Select defaultValue='weekly' size='small' sx={{ borderRadius: 3, paddingRight: 4 }}>
            <MenuItem value='weekly'>Weekly</MenuItem>
          </Select>
        </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <IconButton onClick={handlePrev}>
            <ArrowBack />
          </IconButton>
          <Stack direction='row' gap={3}>
            {currentWeeks.map((day, index) => (
              <DateBox key={index} date={day} isActive={selectedDay.isSame(day, 'date')} onClick={setSelectedDay} />
            ))}
          </Stack>
          <IconButton onClick={handleNext}>
            <ArrowForward />
          </IconButton>
        </Stack>
      </Stack>
      <Stack
        direction='row'
        width={1000}
        position='relative'
        height='48vh'
        sx={{ overflowX: 'scroll', overflowY: 'scroll' }}
        my={4}
      >
        {timestampsInADay.map((time) => (
          <Stack direction='row' position='relative' pt={4} key={time}>
            <Divider orientation='vertical' />
            <Typography position='absolute' top={0} left={0} zIndex={10} color={gray[500]}>
              {time}
            </Typography>
            <Box width={400} height='100%' />
          </Stack>
        ))}
        {filterQuizzes.map((quiz) => (
          <BoxContent
            id={quiz.quizInfo.id.toString()}
            height={150}
            width={(quiz.quizInfo.quizTimeLimit / 60) * 400}
            position='absolute'
            left={
              (dayjs(quiz.quizInfo.startDate).hour() + dayjs(quiz.quizInfo.startDate).minute() / 60) * 400 +
              dayjs(quiz.quizInfo.startDate).hour()
            }
            top={40}
            key={`${quiz.quizInfo.id}-${quiz.courseInfo.id}`}
            display='flex'
            flexDirection='column'
            justifyContent='end'
            bgcolor={blue[50]}
            sx={{
              ':hover': {
                border: 1,
                borderColor: 'primary.main',
              },
            }}
          >
            <Typography color='primary'>{`${dayjs(quiz.quizInfo.startDate).format('HH:mm')} - ${dayjs(
              quiz.quizInfo.endDate,
            ).format('HH:mm')}`}</Typography>
            <Typography fontWeight={500} color='primary'>
              {quiz.quizInfo.quizTitle}
            </Typography>
          </BoxContent>
        ))}
      </Stack>
    </BoxContent>
  )
}
