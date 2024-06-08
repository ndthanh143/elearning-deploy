import { icons } from '@/assets/icons'
import { ConfirmPopup, CustomModal, CustomSelect, Dropzone, Flex, IconContainer } from '@/components'
import { useBoolean } from '@/hooks'
import { StudentCard } from '@/pages'
import { gray, primary } from '@/styles/theme'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Modal,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'

const ListMembers = () => {
  return (
    <Stack gap={2}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StudentCard key={index} />
      ))}
    </Stack>
  )
}

const TaskStatus = ({ status }: { status: 'done' | 'undone' }) => {
  return (
    <Chip
      label={status === 'done' ? 'Done' : 'Undone'}
      color={status === 'done' ? 'success' : 'primary'}
      variant={status === 'done' ? 'filled' : 'outlined'}
    />
  )
}

const TaskCard = () => {
  return (
    <Badge
      badgeContent={'1'}
      color='primary'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Card
        variant='outlined'
        sx={{
          ':hover': {
            filter: `drop-shadow(0 0 0.2rem ${primary[200]})`,
            cursor: 'pointer',
          },
          transition: 'all 0.15s ease-in-out',
        }}
      >
        <CardContent>
          <Flex justifyContent='space-between'>
            <Flex gap={1}>
              <Box width={20} height={20}>
                {icons['task']}
              </Box>
              <Typography fontWeight={700} variant='body2'>
                Task 1
              </Typography>
            </Flex>
            <TaskStatus status='done' />
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={0.5}>
            {icons['description']}
            <Typography variant='body2'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac odio nec libero fermentum fringilla.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac odio nec libero fermentum fringilla...
            </Typography>
          </Stack>
          <Stack gap={1} mt={2}>
            <Flex gap={2}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={700}>
                12/12/2021 11:59 PM
              </Typography>
            </Flex>
            <Flex gap={2}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={700}>
                12/22/2021 11:59 PM
              </Typography>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
    </Badge>
  )
}

interface ITaskDetailProps {
  isOpen: boolean
  onClose: () => void
}

const TaskDetail = ({ isOpen, onClose }: ITaskDetailProps) => {
  const [file, setFile] = useState<File | null>(null)
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean(false)

  const handleDownloadFile = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleRemoveAnswer = () => {
    setFile(null)
    closeConfirm()
  }

  return (
    <>
      <CustomModal title='Task details' isOpen={isOpen} sx={{ maxWidth: 800 }} onClose={onClose}>
        <Divider sx={{ my: 2 }} />
        <Flex justifyContent='space-between'>
          <Flex gap={1}>
            <Box width={20} height={20}>
              {icons['task']}
            </Box>
            <Typography fontWeight={700} variant='body2'>
              Task 1
            </Typography>
          </Flex>
        </Flex>
        <Stack gap={2}>
          <Stack gap={1} mt={2}>
            <Flex gap={2}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={700}>
                12/12/2021 11:59 PM
              </Typography>
            </Flex>
            <Flex gap={2}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={700}>
                12/22/2021 11:59 PM
              </Typography>
            </Flex>
          </Stack>
        </Stack>
        <Stack gap={0.5} mt={2}>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac odio nec libero fermentum fringilla. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Donec ac odio nec libero fermentum fringilla...
          </Typography>
        </Stack>
        <Stack mt={2} gap={1}>
          <Flex gap={1}>
            {icons['resource']}
            <Typography variant='body2' fontWeight={700}>
              {file ? 'Your answer' : 'Upload your answer'}
            </Typography>
          </Flex>
          {!file && <Dropzone onFileChange={setFile} />}
          {file && (
            <Stack gap={2}>
              <Box
                border={1}
                borderRadius={3}
                borderColor={'#ededed'}
                px={2}
                py={2}
                sx={{ cursor: 'pointer' }}
                onClick={handleDownloadFile}
              >
                <Flex gap={1}>
                  <IconContainer isActive color='primary'>
                    {icons['resource']}
                  </IconContainer>
                  <Stack>
                    <Typography variant='body2' fontWeight={700}>
                      {file.name}
                    </Typography>
                    <Typography variant='body2' color={gray[400]}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Stack>
                  <Chip
                    label='Remove'
                    onClick={(e) => {
                      e.stopPropagation()
                      openConfirm()
                    }}
                    sx={{ ml: 'auto', bgcolor: primary[500], color: primary[50] }}
                  />
                </Flex>
              </Box>
              <Typography variant='body2' fontWeight={700}>
                Uploader
              </Typography>
              <Flex gap={1}>
                <Avatar src='https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTbyNyLxq6CsGjR7nhyJs0oRhnTSW0SUNYWnMnC-JSExpKha0bac6xzTufwCzAoqLed4J0zztdsnd0wy6U'>
                  R
                </Avatar>
                <Stack>
                  <Typography fontWeight={700} variant='body2'>
                    Cristiano Ronaldo
                  </Typography>
                  <Typography variant='body2' color={gray[400]}>
                    ronaldo.cristiano@gmail.com
                  </Typography>
                </Stack>
              </Flex>
            </Stack>
          )}
          <Flex justifyContent='end' mt={2} gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='contained'>Save</Button>
          </Flex>
        </Stack>
      </CustomModal>
      <ConfirmPopup
        isOpen={isOpenConfirm}
        onClose={closeConfirm}
        onAccept={handleRemoveAnswer}
        title='Remove Answer'
        type='delete'
        subtitle='Are you sure to remove your answer, everyone in group will be notified about this!'
      />
    </>
  )
}

const filterData = [
  { label: 'All', value: 'all' },
  { label: 'Done', value: 'done' },
  { label: 'Undone', value: 'undone' },
]

export function TaskPage() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  return (
    <>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={9}>
            <Flex justifyContent='space-between' mb={1}>
              <Typography fontWeight={700} variant='body1' textAlign='start'>
                Tasks
              </Typography>
              <CustomSelect data={filterData} defaultValue={'all'} size='small' />
            </Flex>
            <Card variant='outlined' sx={{ p: 1 }}>
              <CardContent>
                <Stack gap={4}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} onClick={() => setSelectedTask(index)}>
                      <TaskCard />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight={700} variant='body1' textAlign='start' mb={1}>
              Your groupmates
            </Typography>
            <Card variant='outlined'>
              <CardContent>
                <ListMembers />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <TaskDetail isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  )
}
