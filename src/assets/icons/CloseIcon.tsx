import { Box } from '@mui/material'
import close from './close-icon.png'

export function CloseIcon() {
  return <Box component='img' src={close} alt='close' width={20} height={20} />
}
