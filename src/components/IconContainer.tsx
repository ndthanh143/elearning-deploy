import { primary } from '@/styles/theme'
import { BoxProps } from '@mui/material'
import { Flex } from '.'

interface IIconContainerProps extends BoxProps {
  isActive?: boolean
  color?: 'primary' | 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'black'
}

const renderColors = {
  primary: primary[100],
  blue: '#1976D2',
  green: '#4CAF50',
  red: '#F44336',
  yellow: '#FFC107',
  gray: '#9E9E9E',
  black: '#000',
}

export function IconContainer({ sx, isActive, onClick, color = 'primary', ...props }: IIconContainerProps) {
  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      bgcolor={isActive ? renderColors[color] : 'transparent'}
      borderRadius={3}
      p={1}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      onClick={onClick}
      {...props}
    />
  )
}
