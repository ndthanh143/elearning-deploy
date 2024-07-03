import { Container, Stack, Typography } from '@mui/material'
import { Content } from './components'
import { useEffect, useState } from 'react'
import { courseKeys } from '@/services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

export function SearchPage() {
  const [searchParams] = useSearchParams()

  const searchValue = searchParams.get('q') || ''

  const [page, setPage] = useState(1)

  const categories = (searchParams.getAll('category') || []).map(Number)

  const courseInstance = courseKeys.autoComplete({
    q: searchValue,
    ...(categories.length && { categoryIds: categories.join(',') }),
  })
  const { data: courses, isFetched: isFetchedCourse, refetch: refetchCourses } = useQuery({ ...courseInstance })

  useEffect(() => {
    if (searchValue && isFetchedCourse) {
      refetchCourses()
    }
  }, [searchValue])

  return (
    <Container maxWidth='lg'>
      <Stack my={4} gap={4}>
        <Typography variant='h2' fontWeight={700}>
          {courses?.totalElements || 0} Results for "{searchValue}"
        </Typography>
        <Content
          data={courses?.content || []}
          totalResults={courses?.totalElements || 0}
          page={page}
          count={courses?.totalElements || 0}
          onPageChange={setPage}
        />
      </Stack>
    </Container>
  )
}
