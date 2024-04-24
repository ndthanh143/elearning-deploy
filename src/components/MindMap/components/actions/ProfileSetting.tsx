import { Flex } from '@/components'
import { useAuth, useBoolean, useMenu } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { gray } from '@/styles/theme'
import {
  ChevronLeftOutlined,
  CloseOutlined,
  EditOutlined,
  MoreHorizOutlined,
  SearchOutlined,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  TextField,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

export function ProfileSetting() {
  const { profile } = useAuth()

  const navigate = useNavigate()

  const { lessonPlanId } = useParams()

  const { anchorEl: anchorElMore, isOpen, onClose, onOpen } = useMenu()

  const { value: isSearchOpen, setTrue: openSearch, setFalse: closeSearch } = useBoolean(false)

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data: lessonPlans } = useQuery({ ...lessonPlanInstance })
  const currentLessonPlan = lessonPlans?.content.find((lessonPlan) => lessonPlan.id === Number(lessonPlanId))

  const handleBackPage = () => {
    navigate('/planning')
  }

  const renderModals = () => {
    return (
      <Menu
        open={isOpen}
        anchorEl={anchorElMore}
        onClose={onClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          paper: {
            style: {
              marginTop: 10,
            },
          },
        }}
      >
        {/* <MenuList>
          <MenuItem>
            <ListItemIcon>
              <EditOutlined />
            </ListItemIcon>
            <ListItemText>Edit this plan</ListItemText>
          </MenuItem>
        </MenuList>
        <Divider />
        <MenuList>
          <MenuItem sx={{ color: 'error.main' }}>Delete this plan</MenuItem>
        </MenuList> */}
      </Menu>
    )
  }

  const handleClickSearchIcon = () => {}

  return (
    profile && (
      <>
        {!isSearchOpen && (
          <Box
            position='absolute'
            borderRadius={4}
            bgcolor='white'
            sx={{ boxShadow: 1 }}
            display='flex'
            alignItems='center'
            gap={1}
            top={20}
            px={2}
            py={0.2}
            right={20}
            zIndex={10}
          >
            <IconButton onClick={openSearch} color='secondary'>
              <SearchOutlined fontSize='small' />
            </IconButton>

            <Divider orientation='vertical' flexItem />

            <IconButton color='secondary' onClick={onOpen}>
              <MoreHorizOutlined />
            </IconButton>
            <Avatar src={profile.data.avatarPath} sx={{ width: 30, height: 30, cursor: 'pointer' }}>
              {profile.data.fullName.charAt(0)}
            </Avatar>
          </Box>
        )}
        {isSearchOpen && (
          <Box
            position='absolute'
            borderRadius={4}
            bgcolor='white'
            // sx={{ boxShadow: 1 }}
            border={1}
            borderColor='#ededed'
            alignItems='center'
            top={20}
            px={2}
            right={20}
            zIndex={10}
            maxWidth={300}
          >
            <Flex gap={1} py={1}>
              <IconButton onClick={openSearch} color='secondary' size='small'>
                <SearchOutlined fontSize='small' />
              </IconButton>
              <InputBase size='small' placeholder='Search' sx={{ color: gray[700], fontSize: 16 }} fullWidth />
              <IconButton sx={{ bgcolor: gray[50] }} size='small' onClick={closeSearch}>
                <CloseOutlined fontSize='small' />
              </IconButton>
            </Flex>
            <Divider />
            <Box py={1}>
              <Typography variant='body2' color='secondary.light'>
                Did you know that you can search your topic, title, content
              </Typography>
            </Box>
          </Box>
        )}
        {renderModals()}
      </>
    )
  )
}
