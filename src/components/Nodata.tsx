import { Box, Stack, Typography } from '@mui/material'
import { icons } from '@/assets/icons'

export type NoDataProps = {
  title?: string
}

export const NoData = ({ title = 'No results found' }: NoDataProps) => {
  return (
    <Box display='flex' justifyContent='center' width='100%' m='auto'>
      <Stack gap={1} alignItems='center'>
        {icons['noData']}
        <Typography textAlign='center' fontWeight={400}>
          {title}
        </Typography>
      </Stack>
    </Box>
  )
}
