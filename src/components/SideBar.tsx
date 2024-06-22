import {
  AssignmentRounded,
  EditCalendarRounded,
  EventNoteRounded,
  GridViewRounded,
  GroupsRounded,
  LibraryBooksRounded,
  PeopleRounded,
  TaskRounded,
} from '@mui/icons-material'
import { ReactNode } from 'react'
import { startsWith } from 'lodash'
import { Stack } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks'
import { gray, primary } from '@/styles/theme'
import { RoleEnum } from '@/services/auth/auth.dto'

import { CustomTooltip, Flex, Link } from '.'

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
            color={startsWith(pathname, '/course') ? 'primary' : 'inherit'}
            sx={{ width: 30, height: 30 }}
          />
        ),
        href: '/courses',
      },
      {
        title: 'Group',
        icon: (
          <GroupsRounded
            color={startsWith(pathname, '/group') ? 'primary' : 'inherit'}
            sx={{ width: 30, height: 30 }}
          />
        ),
        href: '/group',
      },
      {
        title: 'Submission',
        icon: (
          <AssignmentRounded
            color={startsWith(pathname, '/submission-management') ? 'primary' : 'inherit'}
            sx={{ width: 30, height: 30 }}
          />
        ),
        href: '/submission-management',
      },
      {
        title: 'Planning',
        icon: (
          <EditCalendarRounded
            fontSize='small'
            color={startsWith(pathname, '/planning') ? 'primary' : 'inherit'}
            sx={{ width: 30, height: 30 }}
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
            sx={{ width: 30, height: 30 }}
          />
        ),
        href: '/student-manage',
      },
    ],
    Student: [
      {
        title: 'Home Page',
        icon: <GridViewRounded color={pathname === '/' ? 'primary' : 'inherit'} sx={{ width: 30, height: 30 }} />,
        href: '/home',
      },
      {
        title: 'Courses',
        icon: (
          <LibraryBooksRounded
            color={startsWith(pathname, '/course') ? 'primary' : 'inherit'}
            sx={{ width: 30, height: 30 }}
          />
        ),
        href: '/courses',
      },
      {
        title: 'Tasks',
        icon: (
          <TaskRounded color={startsWith(pathname, '/tasks') ? 'primary' : 'inherit'} sx={{ width: 30, height: 30 }} />
        ),
        href: '/tasks',
      },
      {
        title: 'Schedule',
        icon: (
          <EventNoteRounded
            color={startsWith(pathname, '/schedule') ? 'primary' : 'inherit'}
            sx={{ width: 30, height: 30 }}
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
        <Stack gap={5} justifyContent='start' alignItems='start'>
          {listMenu[profile.data.role].map((item) => (
            <CustomTooltip title={item.title} key={item.href} placement='right'>
              <Link
                width='fit-content'
                display='flex'
                mx='auto'
                href={item.href}
                justifyContent='center'
                alignItems='center'
                color={gray[900]}
                sx={{
                  p: 1,
                  borderRadius: 3,
                  bgcolor:
                    (startsWith(pathname, item.href) && item.href !== '/') || item.href === pathname
                      ? primary[100]
                      : 'transparent',
                  ':hover': {
                    bgcolor: primary[100],
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {item.icon}
              </Link>
            </CustomTooltip>
          ))}
        </Stack>
      </Flex>
    )
  )
}
