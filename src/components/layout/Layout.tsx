import { Header, SideBar } from '..'
import { Box } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { gray } from '../../styles/theme'
import { useAuth } from '../../hooks'
import { useEffect } from 'react'

export const Layout = () => {
  const navigate = useNavigate()
  const { profile, isFetched } = useAuth()

  useEffect(() => {
    if (isFetched && !profile) {
      navigate('/login')
    }
  }, [profile])

  return (
    <Box bgcolor={gray[100]} minHeight='100vh'>
      <Header />
      <Box display='flex' gap={3} pr={2} pb={3}>
        <SideBar />
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
