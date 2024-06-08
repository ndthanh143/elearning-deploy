import { Box } from '@mui/material'
import data from './icon-title.webp'

export function TitleIcon() {
  return <Box component='img' src={data} alt='title' width={20} height={20} />
}
