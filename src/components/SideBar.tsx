import { useAuth } from '@/hooks'
import { RoleEnum } from '@/services/auth/auth.dto'
import {
  AssignmentIndOutlined,
  EditCalendarOutlined,
  EventNoteOutlined,
  ForumOutlined,
  LibraryBooksOutlined,
  PeopleOutline,
  TimelineOutlined,
} from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { startsWith } from 'lodash'
import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type MenuItemProps = {
  title: string
  icon: ReactNode
  href: string
}
export const SideBar = () => {
  const { profile } = useAuth()

  const { pathname } = useLocation()

  const navigate = useNavigate()

  const listMenu: Record<RoleEnum, MenuItemProps[]> = {
    Teacher: [
      {
        title: 'Courses',
        icon: <LibraryBooksOutlined color={startsWith(pathname, '/course') ? 'primary' : 'inherit'} />,
        href: '/courses',
      },
      {
        title: 'Forum',
        icon: <ForumOutlined color={startsWith(pathname, '/forum') ? 'primary' : 'inherit'} />,
        href: '/forum',
      },
      {
        title: 'Submission',
        icon: <AssignmentIndOutlined color={startsWith(pathname, '/submission-management') ? 'primary' : 'inherit'} />,
        href: '/submission-management',
      },
      {
        title: 'Planning',
        icon: <EditCalendarOutlined color={startsWith(pathname, '/planning') ? 'primary' : 'inherit'} />,
        href: '/planning',
      },
      {
        title: 'Students',
        icon: <PeopleOutline color={startsWith(pathname, '/planning') ? 'primary' : 'inherit'} />,
        href: '/student-manage',
      },
    ],
    Student: [
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
        icon: <ForumOutlined color={startsWith(pathname, '/forum') ? 'primary' : 'inherit'} />,
        href: '/forum',
      },
    ],
    Admin: [],
  }

  return (
    profile && (
      <List sx={{ minWidth: 250 }}>
        {listMenu[profile.data.roleInfo.name].map((item) => (
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
              bgcolor: item.href === '/' && pathname === '/' ? '#fff' : 'inherit',
            }}
            selected={startsWith(pathname, item.href) && item.href !== '/'}
            key={item.title}
            onClick={() => navigate(item.href)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ ...(item.href === pathname && { fontWeight: 500 }) }}>{item.title}</Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    )
  )
}
