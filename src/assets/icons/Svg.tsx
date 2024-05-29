import { styled } from '@mui/material'

export interface ISvgProps {
  size?: number
  color?: string
}

export const Svg = styled('svg')<ISvgProps>(({ size = 24, color = 'currentColor' }) => ({
  width: size,
  height: size,
  color,
}))
