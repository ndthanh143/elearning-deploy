import { Header, SideBar } from '..'
import { Box, Stack } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { RoleEnum } from '@/services/auth/auth.dto'

import 'reactflow/dist/style.css'

export const CourseDetailLayout = ({ children = null }: PropsWithChildren) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { accessToken, profile, isFetched } = useAuth()

  const [isCollapse, setIsCollapse] = useState(false)

  const handleCollapse = () => {
    setIsCollapse(true)
  }

  const handleExpand = () => {
    setIsCollapse(false)
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

  if (profile && profile.data.role === RoleEnum.Admin) {
    navigate('/admin')
  }

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
      <Box bgcolor='#F8F4FE' height='100vh' display='flex' overflow='hidden'>
        <SideBar isCollapse={isCollapse} onCollapse={handleCollapse} />
        <Stack flex={1}>
          <Header isCollapseSideBar={isCollapse} onExpand={handleExpand} />
          <Box padding={2} maxHeight='100vh' sx={{ overflowY: 'scroll' }}>
            {children || <Outlet />}
          </Box>
        </Stack>
      </Box>
    )
  )
}
