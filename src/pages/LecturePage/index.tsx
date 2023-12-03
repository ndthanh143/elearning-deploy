import ReactHtmlParser from 'react-html-parser'
import { useNavigate, useParams } from 'react-router-dom'
import { lectureKeys } from '../../services/lecture/lecture.query'
import { useQuery } from '@tanstack/react-query'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { BoxContent } from '../../components'
import { ArrowBack } from '@mui/icons-material'
import { HeadingList } from './containers'
import { addIdToH2Tags } from '@/utils'
import { DangerouseLyRender } from '@/components'

export const LecturePage = () => {
  const { lectureId, courseId } = useParams()

  const navigate = useNavigate()

  const lectureInstance = lectureKeys.detail(Number(lectureId))
  const { data } = useQuery({ ...lectureInstance, enabled: Boolean(lectureId) })

  const goBack = () => navigate(`/courses/${courseId}`)

  if (!data) {
    return null
  }

  const modifiedContent = addIdToH2Tags(data.lectureContent)

  const listHeading = ReactHtmlParser(modifiedContent)
    .filter((element) => element.type === 'h2')
    .map((h2) => ({ title: h2.props.children[0], id: h2.props.id }))

  return (
    <Grid container spacing={4}>
      <Grid item xs={8}>
        <BoxContent>
          <Stack direction='row' justifyContent='space-between'>
            <Button sx={{ gap: 1 }} onClick={goBack} color='secondary'>
              <ArrowBack fontSize='small' />
              Back
            </Button>
            <Typography variant='h5' fontWeight={500} fontStyle='italic' sx={{ textDecoration: 'underline' }}>
              {data.lectureName}
            </Typography>
          </Stack>
          <DangerouseLyRender content={modifiedContent} />
        </BoxContent>
      </Grid>
      <Grid item xs={4}>
        <HeadingList data={listHeading} />
      </Grid>
    </Grid>
  )
}
