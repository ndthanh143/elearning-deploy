import { Menu, MenuProps } from '@mui/material'

export const CustomMenu = ({ ...props }: MenuProps) => {
  return (
    <Menu
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            borderRadius: 3,
            border: 1,
            borderColor: '#e6e6e6',
            overflow: 'visible',
          },
        },
      }}
      {...props}
    />
  )
}
