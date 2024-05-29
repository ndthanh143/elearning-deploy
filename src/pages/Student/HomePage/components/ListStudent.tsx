import { Flex, NoData } from '@/components'
import { userKeys } from '@/services/user/user.query'
import { gray } from '@/styles/theme'
import { Avatar, Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useQuery } from '@tanstack/react-query'

export const ListStudent = () => {
  const userInstance = userKeys.member()
  const { data, isFetched, isLoading } = useQuery(userInstance)

  return (
    <Card variant='elevation' elevation={1}>
      <CardContent>
        <Flex justifyContent='space-between' mb={1}>
          <Typography fontWeight={700}>Online student</Typography>
          <Typography fontWeight={700} color='primary.main'>
            View more
          </Typography>
        </Flex>
        {!data && isFetched && !isLoading && <NoData title='No relative student found!' />}
        <Box
          display='flex'
          flexDirection='column'
          gap={1}
          mt={2}
          sx={{ overflowY: 'scroll', maxHeight: 700, textOverflow: 'hidden', overflowX: 'hidden', scrollbarWidth: 1 }}
        >
          {isLoading &&
            Array(5)
              .fill(true)
              .map((item) => (
                <Flex gap={2} width='100%' p={1} alignItems='center' key={item}>
                  <Box width={50} height={50}>
                    <Skeleton variant='circular' sx={{ width: '100%', height: '100%' }} />
                  </Box>
                  <Stack flex={1}>
                    <Skeleton width='30%' />
                    <Skeleton width='100%' />
                  </Stack>
                </Flex>
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
              <Avatar src={student.avatarPath} alt={student.fullName} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography fontWeight={700} variant='body2'>
                  {student.fullName}
                </Typography>
                <Typography variant='body2' fontWeight={600} color={gray[700]}>
                  {student.email}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
