import { CustomMenu, Flex, Link, Logo } from '@/components'
import {
  Avatar,
  Box,
  Container,
  Divider,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { CustomButton } from './CustomButton'
import { gray, primary } from '@/styles/theme'
import { useAuth, useMenu, useOnClickOutside } from '@/hooks'
import { Account } from '@/services/user/user.dto'
import { LogoutRounded, SearchRounded } from '@mui/icons-material'
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { courseKeys } from '@/services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { Course } from '@/services/course/course.dto'
import { getAbsolutePathFile } from '@/utils'

const ProfileRender = ({ data }: { data: Account }) => {
  const { anchorEl, onClose, onOpen, isOpen } = useMenu()
  const { logout } = useAuth()

  return (
    <Flex gap={2}>
      <Box sx={{ cursor: 'pointer' }} onClick={onOpen} height='100%'>
        <Avatar src={data.avatarPath} sx={{ bgcolor: primary[500] }}>
          {data.fullName.charAt(0)}
        </Avatar>
      </Box>
      <CustomMenu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ top: 22 }}
      >
        <Stack px={2} pb={1}>
          <Typography fontWeight={600} variant='body2'>
            {data.fullName}
          </Typography>
          <Typography fontWeight={400} variant='body2' color={gray[500]}>
            {data.email}
          </Typography>
        </Stack>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Logout</Typography>
        </MenuItem>
      </CustomMenu>
    </Flex>
  )
}

const CourseItem = ({ data }: { data: Course }) => {
  return (
    <Flex gap={2} py={1}>
      <Box
        component='img'
        src={getAbsolutePathFile(data.thumbnail)}
        width={60}
        height={40}
        sx={{ objectFit: 'cover' }}
      />
      <Stack>
        <Typography variant='body2' fontWeight={600}>
          {data.courseName}
        </Typography>
        <Typography variant='body2' color={gray[500]}>
          {data.categoryInfo?.categoryName}
        </Typography>
      </Stack>
    </Flex>
  )
}

const SearchResultPopup = ({ query, isOpen, onClose }: { query: string; isOpen: boolean; onClose: () => void }) => {
  const courseSearchInstance = courseKeys.autoComplete({ q: query })
  const { data: courseSearchData } = useQuery({ ...courseSearchInstance, enabled: !!query })

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onClose)

  return (
    isOpen &&
    !!courseSearchData?.content.length && (
      <Box
        ref={ref}
        border={1}
        borderColor='#ccc'
        py={0.5}
        width='100%'
        bgcolor='#fff'
        top={'110%'}
        sx={{ zIndex: 999, position: 'absolute', borderRadius: 2 }}
      >
        {courseSearchData?.content.map((course) => (
          <MenuItem key={course.id} component={Link} href={`/search/${course.id}`} onClick={onClose}>
            <CourseItem data={course} />
          </MenuItem>
        ))}
      </Box>
    )
  )
}

export function NavHeader() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const { profile, isStudent, isTeacher } = useAuth()
  const [searchValue, setSearchValue] = useState(q)
  const [query, setQuery] = useState(q)
  const [isFocused, setIsFocused] = useState(false)

  const navigate = useNavigate()

  const debounceSearch = useCallback(
    debounce((value: string) => {
      setQuery(value)
    }, 300),
    [],
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target
    setSearchValue(value)
    debounceSearch(value)
  }

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(searchValue)}`)
  }

  const menuItems = () => {
    if (isTeacher) {
      return [
        {
          label: 'Teaching',
          href: '/courses',
        },
      ]
    }
    if (isStudent) {
      return [
        {
          label: 'Learning',
          href: '/home',
        },
      ]
    }

    return [
      {
        label: 'Teaching on Brainstone',
        href: '/signup',
      },
    ]
  }

  return (
    <Flex position='fixed' width='100vw' bgcolor='white' zIndex={999} boxShadow={3}>
      <Container sx={{ my: 2 }}>
        <Flex component='form' onSubmit={handleSubmit} justifyContent='space-between' alignItems='center' gap={4}>
          <Logo />
          <Box position='relative' width='100%' onFocus={() => setIsFocused(true)}>
            <TextField
              fullWidth
              onChange={handleChange}
              value={searchValue}
              placeholder='Search any courses..'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchRounded />
                  </InputAdornment>
                ),
                sx: { borderRadius: 10 },
              }}
              size='medium'
            />
            <SearchResultPopup query={query} isOpen={isFocused && !!query} onClose={() => setIsFocused(false)} />
          </Box>
          {menuItems().map((item) => (
            <Link
              href={item.href}
              key={item.label}
              sx={{
                ':hover': {
                  color: primary[500],
                },
              }}
            >
              <Typography px={2} py={2} sx={{ whiteSpace: 'nowrap' }}>
                {item.label}
              </Typography>
            </Link>
          ))}
          {profile ? (
            <ProfileRender data={profile.data} />
          ) : (
            <Flex gap={2} flex={1}>
              <Link sx={{ display: 'flex' }} href='/login'>
                <CustomButton variant='outlined' sx={{ px: 4, whiteSpace: 'nowrap' }}>
                  Login
                </CustomButton>
              </Link>
              <Link sx={{ display: 'flex' }} href='/signup'>
                <CustomButton variant='contained' sx={{ px: 4, display: 'inline-block', whiteSpace: 'nowrap' }}>
                  Sign Up
                </CustomButton>
              </Link>
            </Flex>
          )}
        </Flex>
      </Container>
    </Flex>
  )
}
