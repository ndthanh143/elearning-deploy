import { BoxContent, DangerouseLyRender, YoutubeCard } from '@/components'
import { configs } from '@/configs'
import { useBoolean, useMenu } from '@/hooks'
import { Assignment } from '@/services/assignment/assignment.dto'
import { gray } from '@/styles/theme'
import { downloadFileByLink, formatDate, getAbsolutePathFile } from '@/utils'
import { MoreVert, PeopleAltOutlined } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import { FileCard } from '../components'

export type AssignmentContentProps = {
  assignment: Assignment
}

export const AssignmentContent = ({ assignment }: AssignmentContentProps) => {
  const { pathname } = useLocation()

  const { anchorEl: anchorElMenuMore, isOpen: isOpenMenuMore, onClose: closeMenuMore, onOpen: openMenuMore } = useMenu()

  const { value: isOpenCopyAlert, setFalse: closeCopyAlert, setTrue: openCopyAlert } = useBoolean(false)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${configs.CLIENT_URL}${pathname}`)
    openCopyAlert()
    closeMenuMore()
  }

  const genMenuMoreHeading = () => (
    <>
      <Menu anchorEl={anchorElMenuMore} open={isOpenMenuMore} onClose={closeMenuMore}>
        <MenuItem onClick={handleCopyUrl}>Sao chép đường liên kết</MenuItem>
      </Menu>
      <Snackbar
        open={isOpenCopyAlert}
        autoHideDuration={3000}
        onClose={closeCopyAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeCopyAlert} severity='success' sx={{ width: '100%' }}>
          Copied URL to clipboard
        </Alert>
      </Snackbar>
    </>
  )

  return (
    <>
      <BoxContent>
        <Stack direction='row' justifyContent='space-between' gap={2}>
          <Typography variant='h5'>{assignment.assignmentTitle}</Typography>
          <IconButton onClick={openMenuMore}>
            <MoreVert color='primary' />
          </IconButton>
        </Stack>
        <Box display='flex' gap={1}>
          <Typography variant='body2'>Opened:</Typography>
          <Typography variant='body2' fontWeight={500}>
            {formatDate.toDateTime(assignment.startDate)}
          </Typography>
        </Box>
        <Box display='flex' gap={1}>
          <Typography variant='body2'>Due:</Typography>
          <Typography variant='body2' fontWeight={500}>
            {assignment.endDate ? formatDate.toDateTime(assignment.endDate) : 'Unlimited'}
          </Typography>
        </Box>
        {!(assignment.createDate === assignment.modifiedDate) && (
          <Typography variant='body2' color={gray[500]} fontStyle='italic'>
            Modified: {formatDate.toDateTime(assignment.modifiedDate)}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <DangerouseLyRender content={assignment.assignmentContent} />
        <Grid container spacing={4} mt={2}>
          {assignment.urlDocument &&
            (assignment.urlDocument.includes('youtube.com') ? (
              <Grid item xs={12} md={6}>
                <YoutubeCard videoUrl={assignment.urlDocument} height={250} />
              </Grid>
            ) : (
              <Grid item xs={12} md={6}>
                <FileCard
                  filePath={getAbsolutePathFile(assignment.urlDocument) || ''}
                  onClick={() => downloadFileByLink(assignment.urlDocument)}
                />
              </Grid>
            ))}
        </Grid>
        <Divider sx={{ marginY: 2 }} />
        <Stack direction='row' gap={1} alignItems='center'>
          <PeopleAltOutlined />
          <Typography>Bình luận</Typography>
        </Stack>
        <Button>Thêm bình luận</Button>
      </BoxContent>
      {genMenuMoreHeading()}
    </>
  )
}
