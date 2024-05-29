import { primary } from '@/styles/theme'
import { ButtonProps, Button as MuiButton } from '@mui/material'
import { orange } from '@mui/material/colors'

export function Button({ sx, ...props }: ButtonProps) {
  return (
    <MuiButton
      sx={{ background: `linear-gradient(to right, ${primary[300]}, ${orange[500]})`, color: 'white', ...sx }}
      {...props}
    />
  )
}
