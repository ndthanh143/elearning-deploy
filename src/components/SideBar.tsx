import {
  AssignmentRounded,
  EditCalendarRounded,
  EventNoteRounded,
  GridViewRounded,
  GroupRounded,
  GroupsRounded,
  LibraryBooksRounded,
  PeopleRounded,
} from '@mui/icons-material'
import { ReactNode } from 'react'
import { startsWith } from 'lodash'
import { Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks'
import { gray, primary } from '@/styles/theme'
import { RoleEnum } from '@/services/auth/auth.dto'

import { Flex, Link } from '.'

type MenuItemProps = {
  title: string
  icon: ReactNode
  href: string
}

export const SideBar = () => {
  const { profile } = useAuth()

  const { pathname } = useLocation()

  const listMenu: Record<RoleEnum, MenuItemProps[]> = {
    Teacher: [
      {
        title: 'Courses',
        icon: (
          <LibraryBooksRounded
            sx={{ width: 22, height: 22, color: startsWith(pathname, '/course') ? 'primary.main' : '#404040' }}
          />
        ),
        href: '/courses',
      },
      {
        title: 'Group',
        icon: (
          <GroupsRounded
            sx={{ width: 22, height: 22, color: startsWith(pathname, '/group') ? 'primary.main' : '#404040' }}
          />
        ),
        href: '/group',
      },
      {
        title: 'Submission',
        icon: (
          <AssignmentRounded
            sx={{
              width: 22,
              height: 22,
              color: startsWith(pathname, '/submission-management') ? 'primary.main' : '#404040',
            }}
          />
        ),
        href: '/submission-management',
      },
      {
        title: 'Planning',
        icon: (
          <EditCalendarRounded
            fontSize='small'
            sx={{
              width: 22,
              height: 22,
              color: startsWith(pathname, '/planning') ? 'primary.main' : '#404040',
            }}
          />
        ),
        href: '/planning',
      },
      {
        title: 'Students',
        icon: (
          <PeopleRounded
            fontSize='small'
            color={startsWith(pathname, '/student-manage') ? 'primary' : 'inherit'}
            sx={{ width: 22, height: 22 }}
          />
        ),
        href: '/student-manage',
      },
    ],
    Student: [
      {
        title: 'Home',
        icon: (
          <GridViewRounded sx={{ width: 22, height: 22, color: pathname === '/home' ? 'primary.main' : '#404040' }} />
        ),
        href: '/home',
      },
      {
        title: 'Courses',
        icon: (
          <LibraryBooksRounded
            sx={{ width: 22, height: 22, color: startsWith(pathname, '/course') ? 'primary.main' : '#404040' }}
          />
        ),
        href: '/courses',
      },
      {
        title: 'Tasks',
        icon: (
          <GroupRounded
            sx={{ width: 22, height: 22, color: startsWith(pathname, '/tasks') ? 'primary.main' : '#404040' }}
          />
        ),
        href: '/tasks',
      },
      {
        title: 'Schedule',
        icon: (
          <EventNoteRounded
            sx={{ width: 22, height: 22, color: startsWith(pathname, '/schedule') ? 'primary.main' : '#404040' }}
          />
        ),
        href: '/schedule',
      },
    ],
    Admin: [],
  }

  return (
    profile && (
      <Flex justifyContent='center' pt={6} width={100} overflow='hidden' sx={{ transition: 'all ease 0.2s' }}>
        <Stack gap={2} justifyContent='start' alignItems='start'>
          {listMenu[profile.data.role].map((item) => (
            <Link
              width='fit-content'
              display='flex'
              flexDirection='column'
              mx='auto'
              href={item.href}
              justifyContent='center'
              alignItems='center'
              color={gray[900]}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                bgcolor: startsWith(pathname, item.href) ? '#EAE8FE' : 'transparent',
                ':hover': {
                  bgcolor: '#EAE8FE',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {item.icon}
              <Typography
                variant='caption'
                fontWeight={600}
                color={startsWith(pathname, item.href) ? 'primary' : 'secondary'}
              >
                {item.title}
              </Typography>
            </Link>
          ))}
        </Stack>
      </Flex>
    )
  )
}
