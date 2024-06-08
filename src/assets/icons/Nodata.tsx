import { Box } from '@mui/material'
import nodata from './no-data.png'

export function NoDataIcon() {
  return <Box component='img' src={nodata} alt='no-data' width={150} height={150} />
}
