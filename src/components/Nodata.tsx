import { Box, Stack, Typography } from '@mui/material'
import common from '@/assets/images/icons/common'

export type NoDataProps = {
  title?: string
}

export const NoData = ({ title = 'No results found' }: NoDataProps) => {
  return (
    <Box display='flex' justifyContent='center' width='100%' m='auto'>
      <Stack gap={0} alignItems='center'>
        <Box component='img' src={common.search} borderRadius='50%' width={150} height={150} />
        <Typography textAlign='center'>{title}</Typography>
      </Stack>
    </Box>
  )
}
