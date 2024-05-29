import { Flex } from '@/components'
import { gray } from '@/styles/theme'
import { KeyboardDoubleArrowRightOutlined } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { ListSchedule } from '.'
import { useRef } from 'react'
import { useOnClickOutside } from '@/hooks'

interface IModalScheduleProps {
  onClose: () => void
  isOpen: boolean
}

export function ModalSchedule({ isOpen, onClose }: IModalScheduleProps) {
  const ref = useRef(null)
  useOnClickOutside(ref, onClose)
  return (
    isOpen && (
      <Box
        ref={ref}
        position='fixed'
        right={0}
        top={0}
        bottom={0}
        minWidth={300}
        borderLeft={1}
        borderColor={gray[100]}
        bgcolor='white'
        p={2}
      >
        <Flex gap={1} justifyContent='space-between'>
          <Tooltip title='Close Schedule'>
            <IconButton size='small' onClick={onClose}>
              <KeyboardDoubleArrowRightOutlined fontSize='small' />
            </IconButton>
          </Tooltip>
          <Typography variant='body2' fontWeight={700}>
            Your comming tasks
          </Typography>
        </Flex>
        <ListSchedule />
      </Box>
    )
  )
}
