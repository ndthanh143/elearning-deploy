import { Box } from '@mui/material'
import { Header, SideBar } from '@/components'
import { Outlet } from 'react-router-dom'

export const TeacherLayout = () => {
  return (
    <Box bgcolor='#ECEFF3' minHeight='100vh'>
      <Box position='fixed' width='100vw' bgcolor='#ECEFF3' zIndex={10}>
        <Header />
      </Box>
      <Box display='flex' gap={3} pr={2} pb={3} pt={12}>
        <Box position='fixed'>
          <SideBar />
        </Box>
        <Box flex={1} ml={35}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
