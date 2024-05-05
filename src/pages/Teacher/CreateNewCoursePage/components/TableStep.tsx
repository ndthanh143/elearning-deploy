import { Flex } from '@/components'
import { Box, Divider, Stack } from '@mui/material'

interface ITableStepProps {
  step: number
  onChange: (step: number) => void
}

const listStepTitle = ['Basic Information', 'Course Plan Selection', 'Price Configuration', 'Newsletter']

export function TableStep({ onChange, step }: ITableStepProps) {
  return (
    <Stack gap={2}>
      {listStepTitle.map((title, index) => (
        <Flex gap={1} alignItems='center'>
          {index === step && (
            <Divider orientation='vertical' variant='fullWidth' sx={{ bgcolor: 'primary.main' }} flexItem />
          )}
          <Box
            key={index}
            sx={{
              cursor: 'pointer',
              color: index === step ? 'primary.main' : 'text.primary',
              fontWeight: index === step ? 700 : 400,
            }}
            onClick={() => onChange(index)}
          >
            {title}
          </Box>
        </Flex>
      ))}
    </Stack>
  )
}
