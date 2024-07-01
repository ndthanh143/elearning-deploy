import { NavHeader } from '@/pages/Common/HomePage/components'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <Box>
      <NavHeader />
      <Box pt={10}>
        <Outlet />
      </Box>
    </Box>
  )
}
