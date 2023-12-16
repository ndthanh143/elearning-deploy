import { BoxContent, Loading, NoData, PageContentHeading } from '@/components'
import { Avatar, Box, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '@/hooks'
import { useQuery } from '@tanstack/react-query'
import { SearchOutlined } from '@mui/icons-material'
import { ChangeEvent, useEffect, useState } from 'react'
import { topicKeys } from '@/services/topic/topic.query'
import { ForumTopic } from '../CourseDetailPage/components/ForumTopic'
import { forumKeys } from '@/services/forum/forum.query'
import { Forum } from '@/services/forum/forum.dto'
import { blue } from '@mui/material/colors'
import common from '@/assets/images/icons/common'

export const ForumPage = () => {
  const { profile } = useAuth()

  const [search, setSearch] = useState('')

  const [selectedForum, setSelectedForum] = useState<Forum | undefined>()

  const forumsInstance = forumKeys.list({ accountId: Number(profile?.data.id), title: search })
  const { data: forums, isFetched } = useQuery({ ...forumsInstance, enabled: Boolean(profile) })

  const topicInstance = topicKeys.list({ forumId: Number(selectedForum?.id) })
  const { data: topics } = useQuery({ ...topicInstance, enabled: Boolean(selectedForum) })

  const handleSetSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(e.target.value)

  useEffect(() => {
    if (forums) {
      setSelectedForum(forums.content[0])
    }
  }, [forums])

  return (
    <Box>
      <PageContentHeading />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <BoxContent minHeight='70vh'>
            <TextField
              size='small'
              value={search}
              onChange={handleSetSearch}
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
            {forums && forums.content.length ? (
              <Stack marginTop={2} height='60vh' sx={{ overflowY: 'scroll' }}>
                {forums.content.map((forum) => (
                  <Stack
                    key={forum.id}
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
                    <Avatar src={forum.courseInfo.thumbnail || common.course} />
                    <Stack>
                      <Typography fontWeight={500}>{forum.courseInfo.courseName}</Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Box display='flex' alignItems='center' minHeight='60vh'>
                <NoData title='No topic' />
              </Box>
            )}
          </BoxContent>
        </Grid>
        <Grid item xs={8}>
          <Stack gap={3}>
            {topics && isFetched ? (
              topics.content.length ? (
                topics.content.map((topic) => (
                  <BoxContent key={topic.id}>
                    <ForumTopic data={topic} />
                  </BoxContent>
                ))
              ) : (
                <BoxContent minHeight='70vh' display='flex' alignItems='center'>
                  <NoData title="There isn't any topic in this forum!!" />
                </BoxContent>
              )
            ) : (
              <BoxContent minHeight='70vh' display='flex' alignItems='center'>
                <Loading />
              </BoxContent>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
