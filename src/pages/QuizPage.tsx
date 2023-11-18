import { ArrowBack, CheckCircle, Circle, RadioButtonChecked } from '@mui/icons-material'
import { Box, Button, Chip, Divider, Grid, Slider, Stack, Typography } from '@mui/material'
import { PageContentHeading } from '../components'
import { useState } from 'react'
import { generateAwnserKey } from '../utils'
import Countdown from 'react-countdown'
import { useBoolean } from '../hooks'

const questionList = [
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
  {
    title: 'What is a brand?',
    anwsers: [
      {
        text: 'Highland',
      },
      {
        text: 'Phuc Long',
      },
      {
        text: 'The coffee house',
      },
      {
        text: 'Maycha',
      },
    ],
  },
  {
    title: 'How to apply to the jobs?',
    anwsers: [
      {
        text: 'Do the test',
      },
      {
        text: "Marry CEO's daughter",
      },
      {
        text: 'Buy new Car',
      },
      {
        text: 'Be as well as posible',
      },
      {
        text: 'Giảng hòa với sếp',
      },
    ],
  },
]

const totalTime = 10 * 60 * 1000

export const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [anwseredQuestion, setAnwseredQuestion] = useState<String[]>([])
  const [isStarted, handleStarted] = useBoolean(true)

  const [timer, setTimer] = useState(totalTime)

  const handleChangeQuestion = (type: string) => {
    if (type === 'prev') {
      setCurrentQuestionIndex((prev) => (prev === 0 ? questionList.length - 1 : prev - 1))
    }
    if (type === 'next') {
      setCurrentQuestionIndex((prev) => (prev === questionList.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <Box>
      <Button sx={{ gap: 1, mb: 1 }} color='secondary' onClick={() => {}}>
        <ArrowBack />
        Back
      </Button>
      <PageContentHeading
        title='Online business Strategy on Instagram'
        subTitle='Plan your online business, from naming to finding out who your idea customer is'
      />
      {!isStarted ? (
        <Box>hihi</Box>
      ) : (
        <Grid container spacing={4} minHeight={700}>
          <Grid item xs={4}>
            <Box bgcolor='#fff' padding={3} borderRadius={3} height='100%'>
              <Typography fontWeight={500} variant='h6'>
                An important of having a Brand
              </Typography>
              <Stack direction='row' alignItems='center' gap={2}>
                <Slider
                  value={50}
                  sx={{
                    height: 15,
                    '.MuiSlider-thumb': {
                      display: 'none',
                    },
                  }}
                />
                <Stack direction='row'>
                  <Typography fontWeight={700} color='primary'>
                    5
                  </Typography>
                  /6
                </Stack>
              </Stack>
              <Stack
                gap={1}
                sx={{
                  overflowY: 'auto',
                }}
                maxHeight={500}
              >
                {questionList.map((question, index) => {
                  const isActivatingQuestion = currentQuestionIndex === index
                  return (
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='space-between'
                      py={1}
                      sx={{
                        ':hover': {
                          cursor: !isActivatingQuestion ? 'pointer' : 'unset',
                        },
                      }}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      <Stack direction='row' gap={3}>
                        <Typography
                          sx={{
                            ...(isActivatingQuestion && {
                              fontWeight: 500,
                              color: 'primary.main',
                            }),
                          }}
                        >
                          {index + 1}.
                        </Typography>
                        <Typography
                          sx={{
                            ...(isActivatingQuestion && {
                              fontWeight: 500,
                              color: 'primary.main',
                            }),
                          }}
                        >
                          {question.title}
                        </Typography>
                      </Stack>
                      {isActivatingQuestion ? (
                        <RadioButtonChecked color='primary' />
                      ) : anwseredQuestion.includes(question.title) ? (
                        <CheckCircle color='primary' />
                      ) : (
                        <Circle color='secondary' />
                      )}
                    </Stack>
                  )
                })}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box
              padding={3}
              bgcolor='#fff'
              borderRadius={3}
              height='100%'
              display='flex'
              flexDirection='column'
              px={10}
              gap={3}
            >
              <Typography variant='h5' fontWeight={500}>
                {questionList[currentQuestionIndex].title}
              </Typography>
              <Typography>Which elements can you not use when branding on Instagram?</Typography>
              <Stack gap={2} mt={1} mb='auto'>
                {questionList[currentQuestionIndex].anwsers.map((anwser, index) => (
                  <Stack
                    direction='row'
                    alignItems='center'
                    borderRadius={3}
                    gap={2}
                    sx={{ cursor: 'pointer' }}
                    padding={1}
                    border={1}
                  >
                    <Chip label={generateAwnserKey(index)} sx={{ borderRadius: 2, fontWeight: 500 }} />
                    <Typography>{anwser.text}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider />
              <Stack direction='row' gap={2} justifyContent='end'>
                <Button variant='outlined' onClick={() => handleChangeQuestion('prev')}>
                  Previous
                </Button>
                <Button variant='contained' onClick={() => handleChangeQuestion('next')}>
                  Check Anwser
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
