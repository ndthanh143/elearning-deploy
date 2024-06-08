import { Box } from '@mui/material'
import data from './icon-file.png'

export function ResourceIcon() {
  return <Box component='img' src={data} alt='resource' width={20} height={20} />
}
