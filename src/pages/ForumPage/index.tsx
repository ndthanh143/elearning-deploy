import { BoxContent, NoData, PageContentHeading } from '@/components'
import { Avatar, Box, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '@/hooks'
import { useQuery } from '@tanstack/react-query'
import { SearchOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { topicKeys } from '@/services/topic/topic.query'
import { ForumTopic } from '../CourseDetailPage/components/ForumTopic'
import { forumKeys } from '@/services/forum/forum.query'
import { Forum } from '@/services/forum/forum.dto'
import { blue } from '@mui/material/colors'

export const ForumPage = () => {
  const { profile } = useAuth()

  const [searchCourse, setSearchCourse] = useState('')
  const [selectedForum, setSelectedForum] = useState<Forum | undefined>()

  const forumsInstance = forumKeys.list({ accountId: Number(profile?.data.id) })
  const { data: forums } = useQuery({ ...forumsInstance, enabled: Boolean(profile) })

  const topicInstance = topicKeys.list({ forumId: Number(selectedForum?.id) })
  const { data: topics } = useQuery({ ...topicInstance, enabled: Boolean(selectedForum) })

  return (
    <Box>
      <PageContentHeading />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <BoxContent>
            <TextField
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
              placeholder='Search forum...'
              fullWidth
            />

            <Stack marginTop={2}>
              {forums?.content.map((forum) => (
                <Stack
                  direction='row'
                  alignItems='center'
                  sx={{
                    ':hover': {
                      bgcolor: blue[50],
                    },
                    cursor: 'pointer',
                    transition: 'all ease 0.2s',
                  }}
                  bgcolor={selectedForum?.id === forum.id ? blue[50] : 'transparent'}
                  gap={2}
                  padding={2}
                  borderRadius={3}
                  onClick={() => setSelectedForum(forum)}
                >
                  <Avatar
                    src={
                      forum.courseInfo.thumbnail ||
                      'https://blogassets.leverageedu.com/blog/wp-content/uploads/2019/10/23170101/List-of-Professional-Courses-after-Graduation.gif'
                    }
                  />
                  <Stack>
                    <Typography fontWeight={500}>{forum.courseInfo.courseName}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </BoxContent>
        </Grid>
        <Grid item xs={8}>
          <Stack gap={3}>
            {topics ? (
              topics.content.length ? (
                topics.content.map((topic) => (
                  <BoxContent key={topic.id}>
                    <ForumTopic data={topic} />
                  </BoxContent>
                ))
              ) : (
                <BoxContent>
                  <NoData title="There isn't any topic in this forum!!" />
                </BoxContent>
              )
            ) : (
              <BoxContent>
                <Typography>Loading...</Typography>
              </BoxContent>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
