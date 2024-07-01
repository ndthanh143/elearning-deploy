import { LinkProps, Link as MuiLink } from '@mui/material'
import { Link as ReactRouterLink } from 'react-router-dom'

import { FC } from 'react'

export const Link: FC<LinkProps> = ({ sx, ...props }) => {
  return (
    <MuiLink
      {...props}
      component={ReactRouterLink}
      to={props.href ?? '#'}
      sx={{ textDecoration: 'none', color: 'inherit', ...sx }}
    />
  )
}
