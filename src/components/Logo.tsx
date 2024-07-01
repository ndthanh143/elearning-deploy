import { Box } from '@mui/material'
import { Link } from '.'

interface ILogoProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'light' | 'dark'
  type?: 'short' | 'full'
}

export function Logo({ size = 'medium', variant = 'dark', type = 'full' }: ILogoProps) {
  const sizeProps = {
    small: { width: 50, height: 40 },
    medium: { width: 200, height: 50 },
    large: { width: 250, height: 60 },
  }

  const logoSrc = {
    light: type === 'full' ? '/logo-light.png' : '/logo-light-short.png',
    dark: type === 'full' ? '/logo-dark.png' : '/logo-dark-short.png',
  }

  return (
    <Link href='/' sx={{ textDecoration: 'none', cursor: 'pointer' }}>
      <Box
        component='img'
        src={logoSrc[variant]}
        width={type === 'short' ? sizeProps[size].height : sizeProps[size].width}
        height={sizeProps[size].height}
      />
    </Link>
  )
}
