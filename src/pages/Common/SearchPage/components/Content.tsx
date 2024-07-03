import { Divider, Grid, Pagination, Stack, Typography } from '@mui/material'
import { CourseSearchedCard, Filter } from '.'
import { Fragment } from 'react/jsx-runtime'
import { Course } from '@/services/course/course.dto'

interface IContentProps {
  data: Course[]
  page: number
  count: number
  totalResults: number
  onPageChange: (value: number) => void
}

export function Content({ data, page, count, totalResults, onPageChange }: IContentProps) {
  console.log('data', data)
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
        <Stack>
          {data.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && <Divider sx={{ my: 4 }} />}
              <CourseSearchedCard data={item} />
            </Fragment>
          ))}
        </Stack>
        {page > 1 && <Pagination page={page} count={count} onChange={(_, page) => onPageChange(page)} />}
      </Grid>
    </Grid>
  )
}
