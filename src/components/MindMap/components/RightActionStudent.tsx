import { CustomTooltip } from '@/components'
import { useBoolean } from '@/hooks'
import { InfoRounded, ListAltRounded, VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'

interface IRightActionStudentProps {
  toggleViewLessons: (type: 'on' | 'off') => void
}

export function RightActionStudent({ toggleViewLessons }: IRightActionStudentProps) {
  const { value: isViewAllLessons, toggle: toggleViewAllLessons } = useBoolean(false)

  const handleViewAllLessons = () => {
    toggleViewLessons(isViewAllLessons ? 'off' : 'on')
    toggleViewAllLessons()
  }
  const listButtonsProps = {
    toggleView: {
      title: 'Show all lessons',
      icon: isViewAllLessons ? <VisibilityOffRounded /> : <VisibilityRounded />,
      onClick: handleViewAllLessons,
    },
    viewContents: {
      title: 'Show content panel',
      icon: <ListAltRounded />,
      onClick: () => {},
    },
    info: {
      title: 'View info',
      icon: <InfoRounded />,
      onClick: () => {},
    },
  }

  return (
    <Stack
      p={1}
      gap={1}
      position='fixed'
      right={10}
      top='50%'
      bgcolor='white'
      border={1}
      borderColor={'#ededed'}
      borderRadius={8}
      sx={{ transform: 'translateY(-50%)' }}
      zIndex={1001}
    >
      {Object.entries(listButtonsProps).map(([key, value]) => (
        <CustomTooltip title={value.title} key={key} placement='left'>
          <IconButton onClick={value.onClick} color='primary'>
            {value.icon}
          </IconButton>
        </CustomTooltip>
      ))}
    </Stack>
  )
}
