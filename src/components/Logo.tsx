import { Box } from '@mui/material'
import { Link } from '.'

interface ILogoProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'light' | 'dark'
  type?: 'short' | 'full'
}

export function Logo({ size = 'medium', variant = 'dark', type = 'full' }: ILogoProps) {
  const sizeProps = {
    small: { width: 150, height: 30 },
    medium: { width: 200, height: 40 },
    large: { width: 250, height: 50 },
  }

  const logoSrc = {
    light: type === 'full' ? '/logo-light.png' : '/logo-light-short.png',
    dark: type === 'full' ? '/logo-dark.png' : '/logo-dark-short.png',
  }

  return (
    <Link href='/' sx={{ textDecoration: 'none', cursor: 'pointer', display: 'flex' }}>
      <Box
        component='img'
        src={logoSrc[variant]}
        width={type === 'short' ? sizeProps[size].height : sizeProps[size].width}
        height={sizeProps[size].height}
      />
    </Link>
  )
}
