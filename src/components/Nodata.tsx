import { Box, Stack, Typography } from '@mui/material'
import common from '@/assets/images/icons/common'

export type NoDataProps = {
  title?: string
}

export const NoData = ({ title = 'No results found' }: NoDataProps) => {
  return (
    <Box display='flex' justifyContent='center' width='100%'>
      <Stack gap={0} alignItems='center'>
        <Box component='img' src={common.search} borderRadius='50%' width={100} height={100} />
        <Typography textAlign='center'>{title}</Typography>
      </Stack>
    </Box>
  )
}
