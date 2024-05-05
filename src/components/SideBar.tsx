import { images } from '@/assets/images'
import { useAuth, useOnClickOutside } from '@/hooks'
import { RoleEnum } from '@/services/auth/auth.dto'
import { blue } from '@/styles/theme'
import {
  AssignmentIndOutlined,
  EditCalendarOutlined,
  EventNoteOutlined,
  ForumOutlined,
  KeyboardDoubleArrowLeftOutlined,
  LibraryBooksOutlined,
  PeopleOutline,
  TimelineOutlined,
} from '@mui/icons-material'
import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { startsWith } from 'lodash'
import { ReactNode, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type MenuItemProps = {
  title: string
  icon: ReactNode
  href: string
}

interface ISideBarProps {
  isCollapse: boolean
  onCollapse: () => void
}

export const SideBar = ({ isCollapse, onCollapse }: ISideBarProps) => {
  const { profile } = useAuth()

  const sideBarRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(sideBarRef, onCollapse)

  const { pathname } = useLocation()

  const navigate = useNavigate()

  const listMenu: Record<RoleEnum, MenuItemProps[]> = {
    Teacher: [
      {
        title: 'Courses',
        icon: <LibraryBooksOutlined fontSize='small' color={startsWith(pathname, '/course') ? 'primary' : 'inherit'} />,
        href: '/courses',
      },
      {
        title: 'Forum',
        icon: <ForumOutlined fontSize='small' color={startsWith(pathname, '/forum') ? 'primary' : 'inherit'} />,
        href: '/forum',
      },
      {
        title: 'Submission',
        icon: (
          <AssignmentIndOutlined
            fontSize='small'
            color={startsWith(pathname, '/submission-management') ? 'primary' : 'inherit'}
          />
        ),
        href: '/submission-management',
      },
      {
        title: 'Planning',
        icon: (
          <EditCalendarOutlined fontSize='small' color={startsWith(pathname, '/planning') ? 'primary' : 'inherit'} />
        ),
        href: '/planning',
      },
      {
        title: 'Students',
        icon: <PeopleOutline fontSize='small' color={startsWith(pathname, '/planning') ? 'primary' : 'inherit'} />,
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
        icon: <LibraryBooksOutlined fontSize='small' color={startsWith(pathname, '/course') ? 'primary' : 'inherit'} />,
        href: '/courses',
      },
      {
        title: 'Schedule',
        icon: <EventNoteOutlined fontSize='small' color={startsWith(pathname, '/schedule') ? 'primary' : 'inherit'} />,
        href: '/schedule',
      },
      {
        title: 'Forum',
        icon: <ForumOutlined fontSize='small' color={startsWith(pathname, '/forum') ? 'primary' : 'inherit'} />,
        href: '/forum',
      },
    ],
    Admin: [],
  }

  return (
    profile && (
      <Box
        width={isCollapse ? 0 : 200}
        overflow='hidden'
        sx={{ transition: 'all ease 0.2s' }}
        maxWidth={250}
        borderRight={1}
        borderColor={'#ededed'}
        ref={sideBarRef}
      >
        <Box display='flex' justifyContent='space-between' py={1} px={2} alignItems='center'>
          <Box display='flex' alignItems='center' gap={2}>
            <Box
              component='img'
              src={images.logo}
              alt='logo'
              width={30}
              height={30}
              style={{
                objectFit: 'cover',
              }}
            />
          </Box>
          <Tooltip title='Close sidebar'>
            <IconButton onClick={onCollapse}>
              <KeyboardDoubleArrowLeftOutlined />
            </IconButton>
          </Tooltip>
        </Box>
        <List>
          {listMenu[profile.data.roleInfo.name].map((item) => (
            <ListItemButton
              sx={{
                borderRadius: 3,
                margin: 1,
                '&.Mui-selected': {
                  bgcolor: blue[50],
                  ':hover': {
                    bgcolor: blue[50],
                  },
                },
                bgcolor: item.href === '/' && pathname === '/' ? '#fff' : 'inherit',
              }}
              selected={startsWith(pathname, item.href) && item.href !== '/'}
              key={item.title}
              onClick={() => navigate(item.href)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: item.href === pathname ? 500 : 400,
                      color: item.href === pathname ? 'primary.main' : '#000',
                    }}
                  >
                    {item.title}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
        {/* <Box display='flex' justifyContent='start' alignItems='center'>
            <Popover
              open={isOpenMiniSideBar}
              anchorEl={anchorElMini}
              onClose={closeMiniSideBar}
              anchorOrigin={{
                horizontal: 'left',
                vertical: 'center',
              }}
            >
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
            </Popover>
          </Box> */}
      </Box>
    )
  )
}
