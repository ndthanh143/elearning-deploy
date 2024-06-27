import { Flex, Header, SideBar } from '..'
import { Box } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { PropsWithChildren, useEffect } from 'react'
import { useWebSocket, useAuth } from '@/hooks'

import 'reactflow/dist/style.css'

export const Layout = ({ children = null }: PropsWithChildren) => {
  const navigate = useNavigate()

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

  useEffect(() => {
    const pathname = window.location.href.replace(window.location.origin, '')
    console.log('from', pathname)
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
            <SideBar />
          </Box>
          <Box py={10} sx={{ overflowY: 'scroll' }} flex={1} height='100vh'>
            {children || <Outlet />}
          </Box>
        </Flex>
      </Box>
    )
  )
}
