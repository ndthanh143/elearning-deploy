import { primary } from '@/styles/theme'
import { BoxProps } from '@mui/material'
import { Flex } from '.'

interface IIconContainerProps extends BoxProps {
  isActive?: boolean
}

export function IconContainer({ isActive, ...props }: IIconContainerProps) {
  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      bgcolor={isActive ? primary[100] : 'transparent'}
      borderRadius={3}
      p={0.5}
      {...props}
    />
  )
}
