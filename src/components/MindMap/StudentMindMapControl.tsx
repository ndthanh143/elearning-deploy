import { gray } from '@/styles/theme'
import { Flex } from '..'
import { Box, IconButton, Typography } from '@mui/material'
import { StartRounded } from '@mui/icons-material'

export function StudentMindMapControl() {
  const listIcon = [
    <StartRounded color='primary' />,
    <StartRounded color='primary' />,
    <StartRounded color='primary' />,
    <StartRounded color='primary' />,
  ]
  return (
    <Flex
      zIndex={1001}
      position='fixed'
      bottom={-60}
      bgcolor='primary.main'
      px={10}
      pb={4}
      pt={10}
      border={1}
      borderColor={gray[200]}
      left='50%'
      sx={{
        borderTopLeftRadius: '100%',
        borderTopRightRadius: '100%',
        color: 'primary.contrastText',
        transform: 'translateX(-50%)',
      }}
    >
      <Typography
        fontWeight={700}
        color='primary.contrastText'
        position='absolute'
        top={20}
        left='50%'
        sx={{ transform: 'translateX(-50%)', cursor: 'default   ' }}
      >
        Mornitor
      </Typography>
      {listIcon.map((icon, index) => (
        <Box position='absolute' top={-80} left={index * 100} sx={{ transform: 'translateX(-50%)' }}>
          <IconButton>{icon}</IconButton>
        </Box>
      ))}
    </Flex>
  )
}
