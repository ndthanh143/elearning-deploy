import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material'
import { CourseSearchedCard, Filter } from '.'
import { Fragment } from 'react/jsx-runtime'
import { Course } from '@/services/course/course.dto'

interface IContentProps {
  data: Course[]
  totalResults: number
}

export function Content({ data, totalResults }: IContentProps) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Typography variant='body1' fontWeight={700} mb={2}>
          Filter
        </Typography>
        <Filter />
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1' fontWeight={700} mb={2}>
          {`${totalResults} results`}
        </Typography>
        <Card>
          <CardContent>
            <Stack>
              {data.map((item) => (
                <Fragment key={item.id}>
                  <CourseSearchedCard data={item} />
                  <Divider sx={{ my: 4 }} />
                </Fragment>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
