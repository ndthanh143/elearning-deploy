import { CustomTooltip } from '@/components'
import { TopicOutlined } from '@mui/icons-material'
import { Fab } from '@mui/material'
import { ModalActionsTopic } from '../components'
import { TopicList } from '.'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAlert, useAuth, useBoolean } from '@/hooks'
import { topicKeys } from '@/services/topic/topic.query'
import { topicService } from '@/services/topic/topic.service'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { primary } from '@/styles/theme'

export function TopicFab({ courseId }: { courseId: number }) {
  const { triggerAlert } = useAlert()
  const { hash } = useLocation()

  const queryClient = useQueryClient()

  const { profile } = useAuth()

  const { value: isOpenCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)
  const { value: isOpenTopic, setFalse: closeTopic, setTrue: openTopics } = useBoolean(Boolean(hash))

  const { mutate: mutateCreateTopic, isPending: isPendingCreateTopic } = useMutation({
    mutationFn: topicService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
      closeCreateTopic()
      triggerAlert('Create Topic successfully!')
    },
  })

  const handleCreateTopic = (values: string) => {
    if (profile) {
      mutateCreateTopic({ forumId: courseId, accountId: profile.data.id, topicContent: values })
    }
  }

  useEffect(() => {
    const elementWithIdHash = document.getElementById(hash.replace('#', ''))

    if (elementWithIdHash) {
      elementWithIdHash.scrollIntoView({ behavior: 'smooth' })
      // make element have a yellow background
      elementWithIdHash.style.backgroundColor = primary[100]
      // make transition effect
      elementWithIdHash.style.transition = 'background-color 2s ease'
      // remove yellow background after 3 seconds
      setTimeout(() => {
        elementWithIdHash.style.backgroundColor = ''
      }, 2000)
    }
  }, [hash])

  return (
    <>
      <CustomTooltip title='Open topics'>
        <Fab
          sx={{
            position: 'absolute',
            bottom: 50,
            right: 50,
            visibility: isOpenTopic ? 'hidden' : 'visible',
            transition: 'all ease 0.1s',
          }}
          onClick={openTopics}
          color='primary'
        >
          <TopicOutlined />
        </Fab>
      </CustomTooltip>
      <ModalActionsTopic
        isOpen={isOpenCreateTopic}
        onClose={closeCreateTopic}
        onSubmit={handleCreateTopic}
        status='create'
        isLoading={isPendingCreateTopic}
      />

      <TopicList forumId={courseId} isOpen={isOpenTopic} onClose={closeTopic} />
    </>
  )
}
