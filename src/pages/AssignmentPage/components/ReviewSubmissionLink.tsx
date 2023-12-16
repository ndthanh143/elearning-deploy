import { useCopy } from '@/hooks'
import { Button, Stack, TextField } from '@mui/material'
export type ReviewSubmissionLinkProps = {
  link: string
  onUpdate?: () => void
}

export const ReviewSubmissionLink = ({ link }: ReviewSubmissionLinkProps) => {
  const { isCopied, onCopy } = useCopy({ autoReset: true })
  return (
    <Stack gap={2}>
      <TextField value={link} />
      <Button variant='outlined' onClick={() => onCopy(link)}>
        {isCopied ? 'Copied' : 'Copy'}
      </Button>
    </Stack>
  )
}
