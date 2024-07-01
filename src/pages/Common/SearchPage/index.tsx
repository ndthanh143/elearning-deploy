import { Container, Stack, Typography } from '@mui/material'
import { Content } from './components'
import { useEffect } from 'react'
import { courseKeys } from '@/services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

export function SearchPage() {
  const [searchParams] = useSearchParams()

  const searchValue = searchParams.get('q') || ''

  const categories = (searchParams.getAll('category') || []).map(Number)

  useEffect(() => {}, [searchParams])

  const courseInstance = courseKeys.autoComplete({ q: searchValue, categoryId: categories[categories.length - 1] })
  const { data: courses, isFetched: isFetchedCourse, refetch: refetchCourses } = useQuery({ ...courseInstance })

  useEffect(() => {
    if (searchValue && isFetchedCourse) {
      refetchCourses()
    }
  }, [searchValue])

  return (
    <Container maxWidth='lg'>
      <Stack my={4} gap={4}>
        <Typography>
          {courses?.totalElements || 0} Results for {}
        </Typography>
        <Content data={courses?.content || []} totalResults={courses?.totalElements || 0} />
      </Stack>
    </Container>
  )
}
