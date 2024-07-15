import { Button, ButtonProps, CircularProgress } from '@mui/material'

export function LoadingButton({ isLoading, ...props }: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button disabled={isLoading} startIcon={isLoading && <CircularProgress size={16} color='secondary' />} {...props} />
  )
}
