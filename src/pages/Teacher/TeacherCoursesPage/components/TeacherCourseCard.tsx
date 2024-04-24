import common from '@/assets/images/icons/common'
import { ConfirmPopup, Flex } from '@/components'
import { useBoolean, useMenu } from '@/hooks'
import { Course } from '@/services/course/course.dto'
import { getAbsolutePathFile } from '@/utils'
import { CategoryOutlined, DeleteOutline, EditOutlined, Groups, MoreHorizOutlined } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material'
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

  return (
    <>
      <Stack
        gap={2}
        alignItems='center'
        p={2}
        m={-1}
        borderRadius={3}
        overflow='hidden'
        sx={{
          cursor: 'pointer',
        }}
        border={1}
        borderColor='#ededed'
        onClick={handleClick}
      >
        <Box
          component='img'
          src={getAbsolutePathFile(data.thumbnail) || common.course}
          width='100%'
          height={200}
          borderRadius={3}
          sx={{ objectFit: 'cover', border: '1px solid #ededed' }}
        />
        <Stack gap={1} width='100%'>
          <Flex gap={1} sx={{ opacity: 0.7 }}>
            <CategoryOutlined fontSize='small' />
            <Typography variant='body2'>Design</Typography>
          </Flex>
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
              <Groups />
              <Typography variant='body2'>20 students</Typography>
            </Flex>
            <IconButton onClick={openMore}>
              <MoreHorizOutlined fontSize='small' />
            </IconButton>
          </Flex>
        </Stack>
      </Stack>
      <Menu open={isOpenMore} anchorEl={AnchorElMore} onClose={closeMoreMenu}>
        <MenuItem>
          <ListItemIcon>
            <EditOutlined fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={openConfirmPopup}>
          <ListItemIcon>
            <DeleteOutline fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Remove this course</Typography>
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
      />
    </>
  )
}
