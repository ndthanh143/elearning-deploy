import { BoxContent, Loading, NoData, PageContentHeading } from '@/components'
import { Avatar, Box, Button, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useAuth, useBoolean } from '@/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SearchOutlined } from '@mui/icons-material'
import { ChangeEvent, useEffect, useState } from 'react'
import { topicKeys } from '@/services/topic/topic.query'
import { ForumTopic } from '../CourseDetailPage/components/ForumTopic'
import { forumKeys } from '@/services/forum/forum.query'
import { Forum } from '@/services/forum/forum.dto'
import { blue } from '@mui/material/colors'
import common from '@/assets/images/icons/common'
import { getAbsolutePathFile } from '@/utils'
import { ModalActionsTopic } from '../CourseDetailPage/components'
import { topicService } from '@/services/topic/topic.service'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'

export const ForumPage = () => {
  const queryClient = useQueryClient()

  const { profile } = useAuth()

  const [search, setSearch] = useState('')

  const [searchParams, _] = useSearchParams()

  const { value: isOpenCreateTopic, setTrue: openCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)

  const [selectedForum, setSelectedForum] = useState<Forum | undefined>()

  const forumsInstance = forumKeys.list({ accountId: Number(profile?.data.id), title: search })
  const { data: forums } = useQuery({ ...forumsInstance, enabled: Boolean(profile) })

  const topicInstance = topicKeys.list({ forumId: Number(selectedForum?.id) })
  const {
    data: topics,
    isFetched: isFetchedTopics,
    isLoading: isLoadingTopics,
  } = useQuery({ ...topicInstance, enabled: Boolean(selectedForum) })

  const handleSetSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(e.target.value)

  const { mutate: mutateCreateTopic } = useMutation({
    mutationFn: topicService.create,
    onSuccess: (data) => {
      queryClient.setQueryData(topicInstance.queryKey, [{ ...data, commentInfo: [] }, ...(topics || [])])
      closeCreateTopic()
      toast.success('Create Topic successfully!')
    },
  })

  const handleCreateTopic = (values: string) => {
    if (profile && selectedForum) {
      mutateCreateTopic({ forumId: selectedForum.id, accountId: profile.data.id, topicContent: values })
    }
  }

  useEffect(() => {
    if (forums) {
      if (searchParams.get('id')) {
        const forum = forums.content.find((item) => item.id === Number(searchParams.get('id')))
        setSelectedForum(forum)
      } else setSelectedForum(forums.content[0])
    }
  }, [forums, searchParams])

  return (
    <Box>
      <PageContentHeading />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <BoxContent minHeight='70vh' position='sticky' top={90}>
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
                    <Avatar src={getAbsolutePathFile(forum.courseInfo.thumbnail) || common.course} />
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
            <BoxContent>
              <Button variant='outlined' fullWidth onClick={openCreateTopic}>
                Create Topics
              </Button>
            </BoxContent>
            {isLoadingTopics && (
              <BoxContent minHeight='70vh' display='flex' alignItems='center'>
                <Loading />
              </BoxContent>
            )}
            {(isFetchedTopics && !topics?.length) || !topics?.length ? (
              <BoxContent minHeight='61vh' display='flex' alignItems='center'>
                <NoData title='No data' />
              </BoxContent>
            ) : (
              topics?.map((topic) => (
                <BoxContent key={topic.id}>
                  <ForumTopic data={topic} />
                </BoxContent>
              ))
            )}
          </Stack>
        </Grid>
      </Grid>
      <ModalActionsTopic
        isOpen={isOpenCreateTopic}
        onClose={closeCreateTopic}
        onSubmit={handleCreateTopic}
        status='create'
      />
    </Box>
  )
}
