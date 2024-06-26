import common from '@/assets/images/icons/common'
import { Flex } from '@/components'
import { Course } from '@/services/course/course.dto'
import { Account } from '@/services/user/user.dto'
import { gray } from '@/styles/theme'
import { getAbsolutePathFile } from '@/utils'
import { DownloadRounded, ShareRounded } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'

interface IInfoActionProps {
  course: Course
  recipient: Account
}

export function InfoAction({ course, recipient }: IInfoActionProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack gap={2}>
          <Typography variant='body1' fontWeight={700}>
            Recipient:
          </Typography>
          <Flex gap={2}>
            <Avatar src={recipient.avatarPath} alt={recipient.fullName} sx={{ width: 40, height: 40 }} />
            <Stack justifyContent='center'>
              <Typography fontWeight={500}>{recipient.fullName}</Typography>
              <Typography variant='body2' color={gray[500]}>
                {recipient.email}
              </Typography>
            </Stack>
          </Flex>
        </Stack>
        <Stack gap={2} mt={2}>
          <Typography variant='body1' fontWeight={700}>
            About the course:
          </Typography>
          <Box>
            <Stack gap={2}>
              <CardMedia
                image={getAbsolutePathFile(course.thumbnail) || common.course}
                sx={{ objectFit: 'cover', height: 200, borderRadius: 3, width: '100%' }}
              />
              <Stack>
                <Typography variant='body2' fontWeight={600}>
                  {course.courseName}
                </Typography>
                <Typography variant='caption' color={gray[500]} fontWeight={500}>
                  {course.teacherInfo.fullName}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Flex gap={2} mt={2}>
          <Button variant='outlined' fullWidth endIcon={<DownloadRounded fontSize='small' />}>
            Download
          </Button>
          <Button variant='outlined' fullWidth endIcon={<ShareRounded />}>
            Share
          </Button>
        </Flex>
      </CardContent>
    </Card>
  )
}
