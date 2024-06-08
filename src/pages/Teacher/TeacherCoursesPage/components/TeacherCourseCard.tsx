import common from '@/assets/images/icons/common'
import { ConfirmPopup, Flex } from '@/components'
import { useBoolean, useMenu } from '@/hooks'
import { Course } from '@/services/course/course.dto'
import { getAbsolutePathFile } from '@/utils'
import { CategoryRounded, DeleteRounded, EditRounded, GroupsRounded, MoreHorizOutlined } from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export type TeacherCourseCardProps = {
  data: Course
  onDelete: (id: number) => void
}

export const TeacherCourseCard = ({ data, onDelete }: TeacherCourseCardProps) => {
  const navigate = useNavigate()
  const handleClick = () => navigate(`/courses/${data.id}`)

  const { anchorEl: AnchorElMore, isOpen: isOpenMore, onClose: closeMoreMenu, onOpen: openMore } = useMenu()

  const { value: isOpenConfirmPopup, setTrue: openConfirmPopup, setFalse: closeConfirmPopup } = useBoolean(false)

  const handleClickEdit = () => {
    navigate(`/courses/${data.id}/manage`)
  }

  console.log('data', data)

  return (
    <>
      <Card
        onClick={handleClick}
        className='card'
        sx={{
          cursor: 'pointer',
        }}
      >
        <CardMedia
          className='card-media'
          image={getAbsolutePathFile(data.thumbnail) || common.course}
          sx={{
            height: 200,
            objectFit: 'cover',
          }}
        />
        <CardContent>
          <Stack gap={1} width='100%'>
            <Chip
              color='primary'
              label={
                <Flex gap={0.5} sx={{ opacity: 1 }}>
                  <CategoryRounded fontSize='small' sx={{ width: 15, height: 15 }} />
                  <Typography variant='body2' fontWeight={600}>
                    {data.categoryInfo?.categoryName || '--'}
                  </Typography>
                </Flex>
              }
              sx={{ width: 'fit-content' }}
              size='small'
            />
            <Typography fontWeight={700} fontSize={22}>
              {data.courseName}
            </Typography>
            <Typography
              textOverflow='ellipsis'
              whiteSpace='nowrap'
              overflow='hidden'
              sx={{ lineClamp: 3 }}
              variant='body2'
            >
              {data.description}
            </Typography>
            <Flex justifyContent='space-between'>
              <Flex gap={1}>
                <GroupsRounded />
                <Typography variant='body2'>20 students</Typography>
              </Flex>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  openMore(e)
                }}
              >
                <MoreHorizOutlined fontSize='small' />
              </IconButton>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
      <Menu open={isOpenMore} anchorEl={AnchorElMore} onClose={closeMoreMenu}>
        <MenuItem onClick={handleClickEdit}>
          <ListItemIcon>
            <EditRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={openConfirmPopup} color='error'>
          <ListItemIcon>
            <DeleteRounded fontSize='small' color='error' />
          </ListItemIcon>
          <Typography variant='body2' color='error'>
            Remove this course
          </Typography>
        </MenuItem>
      </Menu>

      <ConfirmPopup
        isOpen={isOpenConfirmPopup}
        onClose={closeConfirmPopup}
        onAccept={() => {
          onDelete(data.id)
          closeConfirmPopup()
        }}
        title='Confirm Delete'
        subtitle='Are you sure to delete this course, this action will delete course forever'
        type='delete'
      />
    </>
  )
}
