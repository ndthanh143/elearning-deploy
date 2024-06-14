import { Button, ButtonProps } from '@mui/material'

export function CustomButton({ sx, ...props }: ButtonProps) {
  return <Button sx={{ boxShadow: 0, borderRadius: 4, ...sx }} {...props} />
}
