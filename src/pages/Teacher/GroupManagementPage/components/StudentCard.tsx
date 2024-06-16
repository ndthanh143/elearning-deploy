import { Flex } from '@/components'
import { Info } from '@/services/group/dto'
import { gray, primary } from '@/styles/theme'
import { getAbsolutePathFile } from '@/utils'
import { Avatar, Stack, Typography } from '@mui/material'

export const StudentCard = ({ data }: { data: Info }) => {
  return (
    <Flex gap={1} sx={{ bgcolor: primary[50], borderRadius: 3, p: 1, width: '100%' }}>
      <Avatar src={getAbsolutePathFile(data.avatarPath)} sx={{ width: 40, height: 40 }}>
        {data.fullName.charAt(0)}
      </Avatar>
      <Stack gap={0} width='100%'>
        <Typography
          variant='body2'
          fontWeight={700}
          textOverflow='ellipsis'
          maxWidth={300}
          whiteSpace='nowrap'
          overflow='hidden'
        >
          {data.fullName}
        </Typography>
        <Typography
          variant='caption'
          textOverflow='ellipsis'
          color={gray[500]}
          maxWidth='100%'
          whiteSpace='nowrap'
          overflow='hidden'
        >
          {data.email}
        </Typography>
      </Stack>
    </Flex>
  )
}
