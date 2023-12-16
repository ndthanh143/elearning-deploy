import { BoxContent, Loading, NoData } from '@/components'
import { Stack } from '@mui/material'
import { ForumTopic } from '../components'
import { topicKeys } from '@/services/topic/topic.query'
import { useQuery } from '@tanstack/react-query'

export type TopicList = {
  forumId: number
}

export const TopicList = ({ forumId }: TopicList) => {
  const topicInstance = topicKeys.list({ forumId })
  const { data: topics } = useQuery({ ...topicInstance })

  return (
    <Stack gap={2}>
      {topics ? (
        topics.length ? (
          topics.map((topic) => (
            <BoxContent key={topic.id}>
              <ForumTopic data={topic} />
            </BoxContent>
          ))
        ) : (
          <BoxContent>
            <NoData title='There is no topic in this course yet' />
          </BoxContent>
        )
      ) : (
        <BoxContent>
          <Loading />
        </BoxContent>
      )}
    </Stack>
  )
}
