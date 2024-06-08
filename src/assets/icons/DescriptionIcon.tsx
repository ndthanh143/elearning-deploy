import { Box } from '@mui/material'
import data from './icon-description.png'

export function DescriptionIcon() {
  return <Box component='img' src={data} alt='description' width={20} height={20} />
}
