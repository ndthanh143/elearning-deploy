import actions from '@/assets/images/icons/actions'
import { Flex } from '@/components'
import { Unit } from '@/services/unit/types'
import { gray } from '@/styles/theme'
import { convertSecond, getTypeUnit } from '@/utils'
import { CheckCircleRounded, LockOutlined } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export type ContentItemProps = {
  unit: Unit
}

export const ContentItem = ({ unit }: ContentItemProps) => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const childType = getTypeUnit(unit)

  const dataProps = {
    lecture: {
      title: unit.lectureInfo?.lectureName,
      iconUrl: actions.lecture,
      onClick: () => navigate(`/courses/${courseId}/u/${unit.id}/lecture/${unit.lectureInfo?.id}`),
      subTitle: '',
    },
    assignment: {
      title: unit.assignmentInfo?.assignmentTitle,
      iconUrl: actions.assignment,
      onClick: () => navigate(`/courses/${courseId}/u/${unit.id}/assign/${unit.assignmentInfo?.id}`),
      subTitle: '',
    },
    resource: {
      title: unit.resourceInfo?.title,
      iconUrl: actions.resource,
      // onClick: () => handleDownloadResource(unit.resourceInfo?.urlDocument || ''),
      // onClick: () => setResourceUrl(`${configs.API_URL}/api/file/download${unit.resourceInfo?.urlDocument}`),
      onClick: () => navigate(`/courses/${courseId}/u/${unit.id}/resource/${unit.resourceInfo?.id}`),
      subTitle: '',
    },
    video: {
      title: unit.resourceInfo?.title,
      iconUrl: actions.video,
      // onClick: () => handleDownloadResource(unit.resourceInfo?.urlDocument || ''),
      // onClick: () => setResourceUrl(`${configs.API_URL}/api/file/download${unit.resourceInfo?.urlDocument}`),
      onClick: () => navigate(`/courses/${courseId}/u/${unit.id}/resource/${unit.resourceInfo?.id}`),
      subTitle: convertSecond(unit.resourceInfo?.duration || 0),
    },
    quiz: {
      title: unit.quizInfo?.quizTitle,
      iconUrl: actions.quiz,
      onClick: () => navigate(`/courses/${courseId}/u/${unit.id}/quiz/${unit.quizInfo?.id}`),
      subTitle: '',
    },
  }

  let status: 'current' | 'done' | 'lock' = 'current'
  if (unit.isDone) {
    status = 'done'
  }
  if (!unit.unlock) {
    status = 'lock'
  }

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          ...(unit.unlock
            ? {
                cursor: 'pointer',
                ':hover': {
                  color: 'primary.main',
                },
              }
            : { opacity: 0.4 }),
        }}
      >
        <Flex gap={2} onClick={dataProps[childType].onClick} py={2} justifyContent='space-between' width='100%'>
          <Flex gap={2}>
            <Box
              component='img'
              src={dataProps[childType].iconUrl}
              alt={dataProps[childType].title}
              width={35}
              height={35}
            />
            <Stack>
              <Typography>{dataProps[childType].title}</Typography>
              {dataProps[childType].subTitle && (
                <Typography variant='caption' color={gray[500]}>
                  {dataProps[childType].subTitle}
                </Typography>
              )}
            </Stack>
          </Flex>
          {status === 'done' && <CheckCircleRounded color='success' />}
          {status === 'lock' && <LockOutlined color='secondary' />}
        </Flex>
      </Box>
    </>
  )
}
