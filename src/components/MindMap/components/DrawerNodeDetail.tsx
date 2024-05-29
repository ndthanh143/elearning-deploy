import { ConfirmPopup, Drawer, Flex } from '@/components'
import { useBoolean } from '@/hooks'
import { unitKey } from '@/services/unit/query'
import { Unit, UpdateUnitPayload } from '@/services/unit/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { DeleteOutline, EditOutlined, KeyboardDoubleArrowRightOutlined, MoreHorizOutlined } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
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

interface IDrawerNodeDetailProps {
  isOpen: boolean
  onClose: () => void
  unit: Unit
}

const schema = object({
  id: number().required(),
  name: string().required(),
  description: string().required(),
  prerequisites: array().of(object({ prerequisiteId: number().required() })),
})

export function DrawerNodeDetail({ isOpen, onClose, unit }: IDrawerNodeDetailProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'more'>('view')

  const queryClient = useQueryClient()

  const unitInstance = unitKey.list({ lessonPlanId: unit.lessonPlanInfo.id })
  const { data: units } = useQuery({
    ...unitInstance,
    select: (data) => data.content.filter((item) => item.id !== unit.id),
  })

  const { register, watch, setValue, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: unit.name,
      description: unit.description,
      id: unit.id,
      prerequisites: unit.prerequisites.map((item) => ({ prerequisiteId: item.id })),
    },
  })

  const ref = useRef<HTMLDivElement | null>(null)
  // useOnClickOutside(ref, onClose)

  const { value: isOpenConfirmPopup, setFalse: closeConfirmPopup, setTrue: openConfirmPopup } = useBoolean()

  const { mutate: mutateDeleteUnit } = useMutation({
    mutationFn: unitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(unitInstance)
      onClose()
      closeConfirmPopup()
    },
  })

  const { mutate: mutateUpdateUnit } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(unitInstance)
      onClose()
      reset()
    },
  })

  const handleDeleteUnit = () => {
    mutateDeleteUnit(unit.id)
  }

  const onSubmitHandler = (payload: UpdateUnitPayload) => {
    mutateUpdateUnit(payload)
  }

  const renderContent = {
    view: (
      <Stack gap={2} p={2}>
        <Typography variant='body2'>
          <b>Name</b>: {unit.name}
        </Typography>
        <Typography variant='body2'>
          <b>Description</b>: {unit.description}
        </Typography>
        <Typography variant='body2'>
          <b>Prerequisites</b>:{' '}
          <>
            {unit.prerequisites.length
              ? unit.prerequisites.map((item) => (
                  <Typography key={item.id} variant='body2'>
                    {item.name}
                  </Typography>
                ))
              : 'None'}
          </>
        </Typography>
        <Chip
          label={unit.unlock ? 'Unlock' : 'Lock'}
          sx={{ width: 'fit-content', py: 1, userSelect: 'none' }}
          color={unit.unlock ? 'primary' : 'default'}
        />
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
            <Box maxWidth={100} component={'pre'}>
              {JSON.stringify(watch('prerequisites'))}
            </Box>
          </Stack>
        </Stack>
      </Box>
    ),
  }

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} ref={ref}>
        <Stack>
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
                <IconButton size='small' onClick={onClose}>
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
