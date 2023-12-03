import { Header, SideBar } from '..'
import { Box } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { useEffect } from 'react'

export const Layout = () => {
  const navigate = useNavigate()
  const { profile, isFetched } = useAuth()

  const { pathname } = useLocation()

  useEffect(() => {
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
      <Box bgcolor={'#ECEFF3'} minHeight='100vh'>
        <Header />
        <Box display='flex' gap={3} pr={2} pb={3}>
          <SideBar />
          <Box flex={1}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    )
  )
}
