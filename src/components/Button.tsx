import { primary } from '@/styles/theme'
import { ButtonProps, Button as MuiButton } from '@mui/material'
import { orange } from '@mui/material/colors'

export function Button({ variant, sx, ...props }: ButtonProps) {
  return (
    <MuiButton
      sx={{
        background: variant === 'contained' ? `linear-gradient(to right, ${primary[300]}, ${orange[500]})` : '#fff',
        color: variant === 'contained' ? 'white' : primary[500],
        ...sx,
      }}
      variant={variant}
      {...props}
    />
  )
}
