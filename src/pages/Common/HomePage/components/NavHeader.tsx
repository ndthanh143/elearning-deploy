import { Flex, Link } from '@/components'
import { Box, Typography } from '@mui/material'
import { CustomButton } from './CustomButton'
import { primary } from '@/styles/theme'

export function NavHeader() {
  return (
    <Flex justifyContent='space-between'>
      <Flex gap={1}>
        <Box component='img' src={'/logo.ico'} width={40} height={40} />
        <Typography variant='h3' fontWeight={700} color={primary[700]}>
          Brainstone
        </Typography>
      </Flex>
      <Flex gap={2}>
        <Link href='/login'>
          <CustomButton variant='outlined' sx={{ px: 4 }}>
            Login
          </CustomButton>
        </Link>
        <Link href='/signup'>
          <CustomButton variant='contained' sx={{ px: 4 }}>
            Sign Up
          </CustomButton>
        </Link>
      </Flex>
    </Flex>
  )
}
