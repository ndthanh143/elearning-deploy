import { Chip, Stack, Typography } from '@mui/material'

export type AnswerProps = {
  label: string
  title: string
  isCorrect?: boolean
  isChosen?: boolean
  isError?: boolean
  onClick?: () => void
}

export const Answer = ({ label, title, isCorrect, isChosen, isError, onClick }: AnswerProps) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      borderRadius={3}
      gap={2}
      sx={{
        cursor: 'pointer',
        ...(isCorrect && {
          borderColor: 'success.main',
          color: 'success.main',
        }),
        ...(isError && {
          borderColor: 'error.main',
          color: 'error.main',
        }),
        ...(isChosen && {
          borderColor: 'primary.main',
          color: 'primary.main',
        }),
      }}
      padding={1}
      border={1}
      onClick={onClick}
    >
      <Chip
        label={label}
        sx={{
          borderRadius: 2,
          fontWeight: 500,
          cursor: 'pointer',
        }}
        color={(isChosen && 'primary') || (isCorrect && 'success') || (isError && 'error') || 'default'}
      />
      <Typography>{title}</Typography>
    </Stack>
  )
}
