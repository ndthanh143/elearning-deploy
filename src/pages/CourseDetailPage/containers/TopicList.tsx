import { Flex } from '@/components'
import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'
import { ForumTopic } from '../components'
import { topicKeys } from '@/services/topic/topic.query'
import { useQuery } from '@tanstack/react-query'
import {
  AddOutlined,
  FilterListOutlined,
  KeyboardDoubleArrowRightOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material'
import { useMenu, useOnClickOutside } from '@/hooks'
import { useRef } from 'react'

export type TopicList = {
  forumId: number
  isOpen: boolean
  onClose: () => void
}

export const TopicList = ({ forumId, isOpen, onClose }: TopicList) => {
  const topicInstance = topicKeys.list({ forumId })
  const { data: topics } = useQuery({ ...topicInstance })

  const {
    anchorEl: anchorElMoreActions,
    isOpen: isOpenMoreActions,
    onOpen: openMoreActions,
    onClose: closeMoreActions,
  } = useMenu()

  const ref = useRef(null)

  const moreActionsItem = [
    {
      text: 'Create new topic',
      icon: <AddOutlined />,
      onClick: () => {},
    },
  ]

  useOnClickOutside(ref, onClose)

  return (
    <>
      <Box
        ref={ref}
        sx={{
          height: '100vh',
          width: isOpen ? 600 : 0,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: 10,
          bgcolor: 'white',
          borderColor: '#ccc',
          boxShadow: 1,
          right: 0,
          bottom: 0,
          top: 0,
          transition: 'all 0.2s ease-in-out',
        }}
        // ref={notiRef}
      >
        <Flex px={2} py={2} justifyContent='space-between'>
          <Flex gap={1}>
            <Tooltip title='More actions'>
              <IconButton size='small' onClick={openMoreActions}>
                <MoreHorizOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Close Inbox'>
              <IconButton size='small' onClick={onClose}>
                <KeyboardDoubleArrowRightOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </Flex>
          <Flex gap={1}>
            <Typography variant='body2' fontWeight={700}>
              Topics
            </Typography>
            <Tooltip title='Filter inbox'>
              <IconButton size='small'>
                <FilterListOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
        <Divider />
        <Stack gap={2} sx={{ overflowY: 'scroll', height: '90vh', px: 2, py: 2 }}>
          {topics &&
            topics.map((topic) => (
              <>
                <Box key={topic.id}>
                  <ForumTopic data={topic} />
                </Box>
                <Divider />
              </>
            ))}
        </Stack>
        <Menu anchorEl={anchorElMoreActions} open={isOpenMoreActions} onClose={closeMoreActions}>
          {moreActionsItem.map((item) => (
            <MenuItem key={item.text} onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Typography variant='body2'>{item.text}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  )
}
