import { icons } from '@/assets/icons'
import { Flex } from '@/components'
import { Box, Chip, ChipProps } from '@mui/material'

interface IPlanLabelProps extends ChipProps {
  type: 'mindmap' | 'basic'
}

const planRenders = {
  mindmap: { label: 'Mind Map', icon: icons['planMindmap'] },
  basic: { label: 'Basic', icon: icons['planBasic'] },
}

export function PlanLabel({ type = 'basic' }: IPlanLabelProps) {
  return (
    <Chip
      variant='filled'
      label={
        <Flex gap={1}>
          <Box width={15} height={15}>
            {planRenders[type].icon}
          </Box>
          {planRenders[type].label}
        </Flex>
      }
      color='primary'
      size='small'
      sx={{ mt: 1 }}
    />
  )
}
