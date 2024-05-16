import { Flex, NoData } from '@/components'
import { userKeys } from '@/services/user/user.query'
import { Avatar, Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useQuery } from '@tanstack/react-query'

export const ListStudent = () => {
  const userInstance = userKeys.member()
  const { data, isFetched, isLoading } = useQuery(userInstance)

  if (!data && isFetched) {
    return <NoData title='No relative student found!' />
  }

  return (
    <Card variant='elevation' elevation={2}>
      <CardContent>
        <Flex justifyContent='space-between' mb={1}>
          <Typography variant='h6'>Online student</Typography>
        </Flex>
        <Box
          display='flex'
          flexDirection='column'
          gap={1}
          sx={{ overflowY: 'scroll', maxHeight: 356, textOverflow: 'hidden', overflowX: 'hidden', scrollbarWidth: 1 }}
        >
          {isLoading &&
            Array(5)
              .fill(true)
              .map((item) => (
                <Stack direction='row' gap={2} width='100%' p={1} alignItems='center' key={item}>
                  <Skeleton sx={{ borderRadius: '50%', width: 50, height: 53 }} />
                  <Stack width='100%'>
                    <Skeleton width='30%' />
                    <Skeleton width='100%' />
                  </Stack>
                </Stack>
              ))}

          {data?.content.map((student) => (
            <Box
              key={student.fullName}
              display='flex'
              alignItems='center'
              gap={2}
              p={1}
              sx={{
                ':hover': {
                  bgcolor: blue[50],
                  cursor: 'pointer',
                  borderRadius: 3,
                },
              }}
            >
              <Avatar src={student.avatarPath} alt={student.fullName} />
              <Box>
                <Typography fontWeight={500}>{student.fullName}</Typography>
                <Typography variant='body2'>{student.email}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
