import { EventNoteOutlined, Forum, LibraryBooksOutlined, TimelineOutlined } from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export const SideBar = () => {
  const { pathname } = useLocation()

  const navigate = useNavigate()

  const listMenu = [
    {
      title: 'Dashboard',
      icon: <TimelineOutlined color={pathname === '/' ? 'primary' : 'inherit'} />,
      href: '/',
    },
    {
      title: 'Courses',
      icon: <LibraryBooksOutlined color={pathname === '/course' ? 'primary' : 'inherit'} />,
      href: '/courses',
    },
    {
      title: 'Schedule',
      icon: <EventNoteOutlined color={pathname === '/schedule' ? 'primary' : 'inherit'} />,
      href: '/schedule',
    },
    {
      title: 'Forum',
      icon: <Forum color={pathname === '/message' ? 'primary' : 'inherit'} />,
      href: '/message',
    },
  ]

  return (
    <List sx={{ minWidth: 250 }}>
      {listMenu.map((item) => (
        <ListItemButton
          sx={{
            borderRadius: 3,
            margin: 1,
            '&.Mui-selected': {
              bgcolor: 'primary.contrastText',
              ':hover': {
                bgcolor: 'primary.contrastText',
              },
            },
          }}
          selected={item.href === pathname}
          key={item.title}
          onClick={() => navigate(item.href)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ ...(item.href === pathname && { fontWeight: 500 }) }}>{item.title}</Typography>}
          />
        </ListItemButton>
      ))}
    </List>
  )
}
