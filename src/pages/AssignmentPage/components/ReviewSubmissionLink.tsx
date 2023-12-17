import { useCopy } from '@/hooks'
import { Button, Stack, TextField, Typography } from '@mui/material'
export type ReviewSubmissionLinkProps = {
  link: string
  onUpdate?: () => void
  onDelete?: () => void
}

export const ReviewSubmissionLink = ({ link, onDelete }: ReviewSubmissionLinkProps) => {
  const { isCopied, onCopy } = useCopy({ autoReset: true })
  return (
    <Stack gap={2}>
      <Stack>
        <Typography fontWeight={500}>Your submit link</Typography>
        <Stack direction='row' gap={2}>
          <TextField value={link} fullWidth size='small' />
          <Button variant='outlined' onClick={() => onCopy(link)}>
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
        </Stack>
      </Stack>
      <Button variant='contained' color='error' onClick={onDelete}>
        Remove
      </Button>
    </Stack>
  )
}
