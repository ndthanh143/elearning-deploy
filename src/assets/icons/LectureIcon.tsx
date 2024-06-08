import { Box } from '@mui/material'
import data from './icon-lecture.png'

export function LectureIcon() {
  return <Box component='img' src={data} alt='lecture' width={20} height={20} />
}
