import { useNavigate, useParams } from 'react-router-dom'
import { lectureKeys } from '../../services/lecture/lecture.query'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Box, Button, Container, Stack, Typography } from '@mui/material'
import { DangerouseLyRenderLecture, Flex } from '../../components'
import { ArrowBack } from '@mui/icons-material'
import { addIdToH2Tags } from '@/utils'
import { DangerouseLyRender } from '@/components'

const BoxComment = () => {
  return (
    <Stack
      p={2}
      my={1}
      border={1}
      borderColor='#ededed'
      borderRadius={2}
      gap={1}
      sx={{
        ':hover': {
          ml: -2,
        },
        transition: 'all ease-in 0.05s',
      }}
    >
      <Flex gap={1}>
        <Avatar sx={{ width: 20, height: 20 }}>A</Avatar>
        <Typography variant='body2' fontWeight={500}>
          Nguyen Duy Thanh
        </Typography>
        <Typography variant='caption' color='#ccc'>
          1m
        </Typography>
      </Flex>
      <Box ml={4}>
        <Typography variant='body2' color='#000'>
          Content goes here...
        </Typography>
      </Box>
    </Stack>
  )
}

// const TextWithComment = ({ content }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedText, setSelectedText] = useState(null);

//   const handleTextSelect = (event) => {
//     const selection = handleTextSelection();
//     if (selection && selection.text) {
//       setAnchorEl(event.currentTarget);
//       setSelectedText(selection);
//     }
//   };

//   return (
//     <div onMouseUp={handleTextSelect} dangerouslySetInnerHTML={{ __html: content }} />
//     <Popover
//       open={Boolean(anchorEl)}
//       anchorEl={anchorEl}
//       onClose={() => setAnchorEl(null)}
//       anchorOrigin={{
//         vertical: 'bottom',
//         horizontal: 'left',
//       }}
//     >
//       <Box p={2}>
//         <TextField fullWidth multiline placeholder="Enter your comment" />
//         <Button onClick={submitComment}>Submit</Button>
//       </Box>
//     </Popover>
//   );
// };

export const LecturePage = () => {
  const { lectureId, courseId } = useParams()

  const navigate = useNavigate()

  const lectureInstance = lectureKeys.detail(Number(lectureId))
  const { data: lectureData } = useQuery({ ...lectureInstance, enabled: Boolean(lectureId) })

  const goBack = () => navigate(`/courses/${courseId}`)

  if (!lectureData) {
    return null
  }

  const modifiedContent = addIdToH2Tags(lectureData.lectureContent)

  return (
    <Container>
      <Flex gap={8}>
        <Box flex={1}>
          <Stack direction='row' justifyContent='space-between'>
            <Button sx={{ gap: 1 }} onClick={goBack} color='secondary'>
              <ArrowBack fontSize='small' />
              Back
            </Button>
            <Typography variant='h5' fontWeight={500} fontStyle='italic' sx={{ textDecoration: 'underline' }}>
              {lectureData.lectureName}
            </Typography>
          </Stack>
          <DangerouseLyRenderLecture content={modifiedContent} />
        </Box>
        <Box width={300} height='100%'>
          <BoxComment />
          <BoxComment />
        </Box>
      </Flex>
    </Container>
  )
}
