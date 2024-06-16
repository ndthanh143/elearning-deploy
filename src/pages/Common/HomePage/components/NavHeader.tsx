import { CustomMenu, Flex, Link } from '@/components'
import { Avatar, Box, Divider, ListItemIcon, MenuItem, Stack, Typography } from '@mui/material'
import { CustomButton } from './CustomButton'
import { gray, primary } from '@/styles/theme'
import { useAuth, useMenu } from '@/hooks'
import { Account } from '@/services/user/user.dto'
import { DashboardRounded, LogoutRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const ProfileRender = ({ data, isTeacher }: { data: Account; isTeacher: boolean; isStudent: boolean }) => {
  const { anchorEl, onClose, onOpen, isOpen } = useMenu()
  const navigate = useNavigate()
  return (
    <>
      <Box sx={{ cursor: 'pointer' }} onClick={onOpen}>
        <Avatar src={data.avatarPath} sx={{ bgcolor: primary[500] }}>
          {data.fullName.charAt(0)}
        </Avatar>
      </Box>
      <CustomMenu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack px={2} pb={1}>
          <Typography fontWeight={600} variant='body2'>
            {data.fullName}
          </Typography>
          <Typography fontWeight={400} variant='body2' color={gray[500]}>
            {data.email}
          </Typography>
        </Stack>
        <Divider />
        <MenuItem
          onClick={() => {
            onClose()
            navigate(isTeacher ? '/courses' : '/home')
          }}
        >
          <ListItemIcon>
            <DashboardRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>{isTeacher ? 'Teaching Managerment' : 'Study board'}</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LogoutRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Logout</Typography>
        </MenuItem>
      </CustomMenu>
    </>
  )
}

export function NavHeader() {
  const { profile, isStudent, isTeacher } = useAuth()
  return (
    <>
      <Flex justifyContent='space-between'>
        <Flex gap={1}>
          <Box component='img' src={'/logo.ico'} width={40} height={40} />
          <Typography variant='h3' fontWeight={700} color={primary[700]}>
            Brainstone
          </Typography>
        </Flex>
        {profile ? (
          <ProfileRender data={profile.data} isTeacher={isTeacher} isStudent={isStudent} />
        ) : (
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
        )}
      </Flex>
    </>
  )
}
