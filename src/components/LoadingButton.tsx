import { Button, ButtonProps, CircularProgress } from '@mui/material'

export function LoadingButton({ isLoading, startIcon, ...props }: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={16} color={props.color || 'secondary'} /> : startIcon}
      {...props}
    />
  )
}
