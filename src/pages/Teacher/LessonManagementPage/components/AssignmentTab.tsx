import { Flex } from '@/components'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { Card, CardContent, CardActions, Typography, Button, Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

export function AssignmentTab() {
  const assignmentInstance = assignmentKeys.list({})
  const { data, isFetched } = useQuery({
    ...assignmentInstance,
  })

  if (!isFetched) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Flex gap={4}>
      {data?.content.map((assignment) => (
        <Card key={assignment.id}>
          <CardContent>
            <Typography variant='body1'>{assignment.assignmentTitle}</Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <Button size='small' color='primary'>
              View
            </Button>
            <Button size='small' color='secondary'>
              Edit
            </Button>
            <Button size='small' color='error'>
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Flex>
  )
}
