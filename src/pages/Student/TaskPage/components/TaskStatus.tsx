import { Chip } from '@mui/material'

export const TaskStatus = ({ status }: { status: 'done' | 'undone' }) => {
  return (
    <Chip
      label={status === 'done' ? 'Done' : 'Undone'}
      color={status === 'done' ? 'success' : 'primary'}
      variant={status === 'done' ? 'filled' : 'outlined'}
    />
  )
}
