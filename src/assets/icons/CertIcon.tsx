import { Box } from '@mui/material'
import data from './icon-cert.png'

export function CertIcon() {
  return <Box component='img' src={data} alt='cert' width={'100%'} height={'100%'} />
}
