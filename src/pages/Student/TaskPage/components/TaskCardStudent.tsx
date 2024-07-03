import { icons } from '@/assets/icons'
import { Flex } from '@/components'
import { primary } from '@/styles/theme'
import { Badge, Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import { TaskStatus } from '.'
import { GroupTask } from '@/services/groupTask/dto'

export function TaskCardStudent({ data, index }: { data: GroupTask; index: number }) {
  return (
    <Badge
      badgeContent={index + 1}
      color='primary'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        width: '100%',
      }}
    >
      <Card
        variant='outlined'
        sx={{
          ':hover': {
            filter: `drop-shadow(0 0 0.2rem ${primary[200]})`,
            cursor: 'pointer',
          },
          transition: 'all 0.15s ease-in-out',
          width: '100%',
        }}
      >
        <CardContent>
          <Flex justifyContent='space-between'>
            <Flex gap={1}>
              <Box width={20} height={20}>
                {icons['task']}
              </Box>
              <Typography fontWeight={700} variant='body2'>
                {data.taskInfo.name}
              </Typography>
            </Flex>
            <TaskStatus status={'done'} />
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={0.5}>
            {icons['description']}
            <Typography variant='body2'>{data.taskInfo.description}</Typography>
          </Stack>
          <Stack gap={1} mt={2}>
            <Flex gap={2}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={700}>
                12/12/2021 11:59 PM
              </Typography>
            </Flex>
            <Flex gap={2}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={700}>
                12/22/2021 11:59 PM
              </Typography>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
    </Badge>
  )
}
