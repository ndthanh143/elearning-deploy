import { useBoolean, useMenu } from '@/hooks'
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { AddOutlined, ListOutlined, PlusOneOutlined, TipsAndUpdatesOutlined } from '@mui/icons-material'

import mindMapIcon from '@/assets/images/planingPage/mindmap.png'
import { AddPlanModal } from '../modals'

export function AddPlanSection() {
  const { value: isOpenCreate, setFalse: closeCreate, setTrue: openCreate } = useBoolean(false)
  const { anchorEl: anchorElMenu, isOpen: isOpenMenu, onClose: closeMenu, onOpen: openMenu } = useMenu()

  const planType = {
    mindMap: {
      icon: mindMapIcon,
      title: 'Mind Map',
    },
    basic: {
      icon: mindMapIcon,
      title: 'Basic',
    },
  }

  return (
    <>
      <Stack direction='row' gap={2}>
        <Button
          variant='contained'
          color='primary'
          sx={{ borderRadius: 4, paddingX: 6, paddingY: 2 }}
          onClick={openMenu}
        >
          <AddOutlined fontSize='large' />
        </Button>
        {Object.values(planType).map((value) => (
          <Button
            variant='outlined'
            sx={{
              width: 140,
              height: 120,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              color: 'black',
            }}
            onClick={openCreate}
          >
            <Box component='img' src={value.icon} alt='mind map' sx={{ width: 30, height: 30 }} />
            <Typography variant='body2'>{value.title}</Typography>
          </Button>
        ))}
      </Stack>
      <AddPlanModal isOpen={isOpenCreate} onClose={closeCreate} />

      <Menu
        anchorEl={anchorElMenu}
        onClose={closeMenu}
        open={isOpenMenu}
        slotProps={{
          paper: {
            style: {
              marginLeft: 8,
              marginTop: 4,
              boxShadow: 'none',
              borderRadius: 16,
              border: '1px solid #E0E0E0',
            },
          },
        }}
      >
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <TipsAndUpdatesOutlined />
            </ListItemIcon>
            <ListItemText>New plan mind map</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <ListOutlined />
            </ListItemIcon>
            <ListItemText>New plan basic</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
