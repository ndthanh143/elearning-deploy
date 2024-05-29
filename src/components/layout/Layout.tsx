import { Flex, Header, SideBar } from '..'
import { Box, Stack } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { RoleEnum } from '@/services/auth/auth.dto'

import 'reactflow/dist/style.css'

export const Layout = ({ children = null }: PropsWithChildren) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { accessToken, profile, isFetched } = useAuth()

  const [isCollapse, setIsCollapse] = useState(false)

  const handleCollapse = () => {
    setIsCollapse(true)
  }

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

  return (
    profile && (
      <Box bgcolor='#F8F4FE'>
        <Box position='fixed' sx={{ left: 0, right: 0, top: 0, zIndex: 10 }}>
          <Header />
        </Box>
        <Flex gap={1} justifyContent='start' alignItems='start'>
          <Box pt={6}>
            <SideBar isCollapse={isCollapse} onCollapse={handleCollapse} />
          </Box>
          <Box py={10} sx={{ overflowY: 'scroll' }} flex={1} height='100vh'>
            {children || <Outlet />}
          </Box>
        </Flex>
      </Box>
    )
  )
}
