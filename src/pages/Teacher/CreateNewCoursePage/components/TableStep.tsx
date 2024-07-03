import { Flex } from '@/components'
import { primary } from '@/styles/theme'
import { InfoRounded, NewspaperRounded, PlayLessonRounded, PriceChangeRounded } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'

interface ITableStepProps {
  step: number
  onChange: (step: number) => void
}

const listStep = [
  {
    title: 'Basic Information',
    description: 'Enter the basic information of the course',
    icon: <InfoRounded color='primary' />,
  },
  {
    title: 'Plan Selection',
    description: 'Select the course plan that suits your needs',
    icon: <PlayLessonRounded color='primary' />,
  },
  // {
  //   title: 'Price Configuration',
  //   description: 'Set the price for your course',
  //   icon: <PriceChangeRounded color='primary' />,
  // },
  {
    title: 'Newsletter',
    description: 'Create a welcome and congratulation message for your students',
    icon: <NewspaperRounded color='primary' />,
  },
]

export function TableStep({ onChange, step }: ITableStepProps) {
  return (
    <Stack gap={3} bgcolor={primary[600]} p={2} borderRadius={4}>
      {listStep.map((item, index) => (
        <Flex gap={1} alignItems='start'>
          <Flex
            justifyContent='center'
            bgcolor='#fff'
            borderRadius='100%'
            p={2}
            sx={{ opacity: index === step ? 1 : 0.6 }}
          >
            {item.icon}
          </Flex>
          <Box
            key={index}
            sx={{
              cursor: 'pointer',
              color: index === step ? '#fff' : '#D2D2D2',
            }}
            onClick={() => onChange(index)}
          >
            <Typography variant='caption' color='#D2D2D2'>
              Step {index + 1}
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
            <Typography variant='caption'>{item.description}</Typography>
          </Box>
        </Flex>
      ))}
    </Stack>
  )
}
