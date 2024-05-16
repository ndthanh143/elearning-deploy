import { Typography } from '@mui/material'

export type ErrorFieldProps = {
  message?: string
  isShow?: boolean
}

export const ErrorField = ({ message = '', isShow = false }: ErrorFieldProps) => {
  return (
    isShow && (
      <Typography variant='caption' color='error'>
        {message}
      </Typography>
    )
  )
}
