import { ConfirmPopup, Flex } from '@/components'
import { useBoolean } from '@/hooks'
import { unitKey } from '@/services/unit/query'
import { Unit, UpdateUnitPayload } from '@/services/unit/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  AutoFixHigh,
  DeleteOutline,
  EditOutlined,
  KeyboardDoubleArrowRightOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { array, number, object, string } from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { unitService } from '@/services/unit'

interface IDrawerChildNodeDetailProps {
  isOpen: boolean
  onClose: () => void
  unit: Unit
  type: 'assignment' | 'lecture' | 'resource' | 'quiz'
  onEdit: () => void
}

const schema = object({
  id: number().required(),
  name: string().required(),
  description: string().required(),
  prerequisites: array().of(object({ prerequisiteId: number().required() })),
})

export function DrawerChildNodeDetail({ isOpen, onClose, unit, onEdit }: IDrawerChildNodeDetailProps) {
  const queryClient = useQueryClient()

  const [mode, setMode] = useState<'view' | 'edit' | 'more'>('view')
  const { value: isOpenConfirmPopup, setFalse: closeConfirmPopup, setTrue: openConfirmPopup } = useBoolean()
  const ref = useRef<HTMLDivElement | null>(null)

  const unitInstance = unitKey.list({ lessonPlanId: Number(unit.lessonPlanInfo?.id) })
  const { data: units } = useQuery({
    ...unitInstance,
    select: (data) =>
      data.content.filter(
        (item) =>
          item.id !== unit.id && (unit.lectureInfo || unit.assignmentInfo || unit.quizInfo || unit.resourceInfo),
      ),
  })

  const { register, setValue, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: unit.name,
      description: unit.description,
      id: unit.id,
      prerequisites: unit.prerequisites.map((item) => ({ prerequisiteId: item.id })),
    },
  })

  const { mutate: mutateDeleteUnit } = useMutation({
    mutationFn: unitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(unitInstance)
      onClose()
      setMode('view')
      closeConfirmPopup()
    },
  })

  const { mutate: mutateUpdateUnit } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(unitInstance)
      onClose()
      setMode('view')
      reset()
    },
  })

  const handleDeleteUnit = () => {
    mutateDeleteUnit(unit.id)
  }

  const onSubmitHandler = (payload: UpdateUnitPayload) => {
    mutateUpdateUnit(payload)
  }

  const handleClose = () => {
    onClose()
    setMode('view')
  }

  const renderContent = {
    view: (
      <Stack gap={2} p={2}>
        <Stack gap={1}>
          <Typography variant='body2'>
            <b>Name</b>:
          </Typography>
          <Typography variant='body2'>{unit.name}</Typography>
        </Stack>
        <Stack gap={1}>
          <Typography variant='body2'>
            <b>Description</b>:
          </Typography>
          <Typography variant='body2'>{unit.description}</Typography>
        </Stack>
        <Stack gap={1}>
          <Typography variant='body2'>
            <b>Prerequisites</b>:
          </Typography>
          {unit.prerequisites.length ? (
            unit.prerequisites.map((item) => <Chip key={item.id} label={item.name} sx={{ width: 'fit-content' }} />)
          ) : (
            <Typography variant='body2'>None</Typography>
          )}
        </Stack>
      </Stack>
    ),
    more: (
      <Stack py={2}>
        <MenuItem onClick={() => setMode('edit')}>
          <ListItemIcon>
            <EditOutlined fontSize='small' />
          </ListItemIcon>
          <ListItemText>
            <Typography variant='body2'>Update this section</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={onEdit}>
          <ListItemIcon>
            <AutoFixHigh fontSize='small' />
          </ListItemIcon>
          <ListItemText>
            <Typography variant='body2'>Edit Content</Typography>
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={openConfirmPopup}>
          <ListItemIcon>
            <DeleteOutline fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText>
            <Typography variant='body2' color='error'>
              Move to trash
            </Typography>
          </ListItemText>
        </MenuItem>
      </Stack>
    ),
    edit: (
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack justifyContent='space-between' height='100%'>
          <Stack gap={2} p={2}>
            <Stack gap={0.5}>
              <Typography variant='caption' fontWeight={700}>
                Name
              </Typography>
              <TextField size='small' fullWidth placeholder='Name' {...register('name')} />
            </Stack>
            <Stack gap={0.5}>
              <Typography variant='caption' fontWeight={700}>
                Description
              </Typography>
              <TextField size='small' fullWidth placeholder='Description' {...register('description')} />
            </Stack>
            <Stack gap={0.5}>
              <Typography variant='caption' fontWeight={700}>
                Presequites
              </Typography>
              <Autocomplete
                multiple
                limitTags={2}
                id='multiple-limit-tags'
                options={units || []}
                defaultValue={unit.prerequisites}
                getOptionLabel={(option) => option.name}
                onChange={(_, newValue) => {
                  setValue(
                    'prerequisites',
                    newValue.map((item) => ({
                      prerequisiteId: item.id,
                    })),
                  )
                }}
                renderInput={(params) => <TextField {...params} size='small' />}
              />
            </Stack>
            <Button variant='contained' fullWidth type='submit'>
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    ),
  }

  return (
    <>
      <Drawer open={isOpen} anchor='right' onClose={handleClose} ref={ref}>
        <Stack minWidth={375}>
          <Flex px={2} py={2} justifyContent='space-between'>
            <Flex gap={1}>
              <Typography variant='body2' fontWeight={700}>
                Config
              </Typography>
            </Flex>
            <Flex gap={1}>
              <Tooltip title='More actions'>
                <IconButton size='small' onClick={() => setMode('more')}>
                  <MoreHorizOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Close'>
                <IconButton size='small' onClick={handleClose}>
                  <KeyboardDoubleArrowRightOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            </Flex>
          </Flex>
          <Divider />
          <Box flex={1}>{renderContent[mode]}</Box>
        </Stack>
      </Drawer>
      <ConfirmPopup
        title='Confirm delete unit'
        subtitle='Are you sure to delete this unit, this action can not be revert'
        onAccept={handleDeleteUnit}
        onClose={closeConfirmPopup}
        isOpen={isOpenConfirmPopup}
        type='delete'
      />
    </>
  )
}
