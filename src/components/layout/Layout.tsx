import { Header, SideBar } from '..'
import { Box } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { useEffect } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { RoleEnum } from '@/services/auth/auth.dto'

export const Layout = () => {
  const { accessToken, profile, isFetched } = useAuth()

  const { init, close } = useWebSocket()
  useEffect(() => {
    if (profile) {
      init()
    } else {
      close()
    }

    return () => {
      close()
    }
  }, [profile])

  const navigate = useNavigate()

  const { pathname } = useLocation()

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', {
        state: {
          from: pathname,
        },
      })
    }
    if (!profile && isFetched) {
      navigate('/login', {
        state: {
          from: pathname,
        },
      })
    }
  }, [profile])

  if (profile && profile.data.roleInfo.name === RoleEnum.Admin) {
    navigate('/admin')
  }

  return (
    profile && (
      <Box bgcolor='#ECEFF3' minHeight='100vh'>
        <Box position='fixed' width='100vw' bgcolor='#ECEFF3' zIndex={10}>
          <Header />
        </Box>
        <Box display='flex' gap={3} pr={2} pb={3} pt={12}>
          <Box position='fixed'>
            <SideBar />
          </Box>
          <Box flex={1} ml={35} pt={2}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    )
  )
}
