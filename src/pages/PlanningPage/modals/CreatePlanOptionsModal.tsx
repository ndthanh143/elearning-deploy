import { AddOutlined } from '@mui/icons-material'
import { ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'

export function CreatePlanOptionsModal() {
  return (
    <MenuList>
      <MenuItem>
        <ListItemIcon>
          <AddOutlined />
        </ListItemIcon>
        <ListItemText>New plan mind map</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <AddOutlined />
        </ListItemIcon>
        <ListItemText>New plan basic</ListItemText>
      </MenuItem>
    </MenuList>
  )
}
