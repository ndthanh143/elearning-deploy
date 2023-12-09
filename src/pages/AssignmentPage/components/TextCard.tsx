import { ConfirmPopup } from '@/components'
import { useBoolean } from '@/hooks'
import { Button, Card, CardContent, CardMedia, Stack } from '@mui/material'

export type TextCardProps = { onReview: () => void; onDelete: () => void }

export const TextCard = ({ onReview, onDelete }: TextCardProps) => {
  const { value, setTrue, setFalse } = useBoolean()
  return (
    <>
      <Card sx={{ gap: 2, width: '100%', borderRadius: 3 }}>
        <CardMedia
          component='img'
          src='https://img.freepik.com/free-vector/online-article-concept-illustration_114360-5193.jpg'
          sx={{ width: '100%', height: 100 }}
        />
        <CardContent>
          <Stack gap={2}>
            <Button variant='outlined' fullWidth onClick={onReview}>
              Review
            </Button>
            <Button variant='contained' fullWidth onClick={setTrue} color='error'>
              Delete
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <ConfirmPopup
        title='Confirm Action'
        subtitle='Are you sure you want to proceed with this action? This action cannot be undone. Please review your decision before confirming.'
        isOpen={value}
        onClose={setFalse}
        onAccept={onDelete}
      />
    </>
  )
}
