import { EventNoteOutlined, Forum, LibraryBooksOutlined, TimelineOutlined } from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { startsWith } from 'lodash'
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
      icon: <LibraryBooksOutlined color={startsWith(pathname, '/course') ? 'primary' : 'inherit'} />,
      href: '/courses',
    },
    {
      title: 'Schedule',
      icon: <EventNoteOutlined color={startsWith(pathname, '/schedule') ? 'primary' : 'inherit'} />,
      href: '/schedule',
    },
    {
      title: 'Forum',
      icon: <Forum color={startsWith(pathname, '/forum') ? 'primary' : 'inherit'} />,
      href: '/forum',
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
          selected={startsWith(pathname, item.href) && item.href !== '/'}
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
