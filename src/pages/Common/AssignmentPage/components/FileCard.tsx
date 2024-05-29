import { ConfirmPopup } from '@/components'
import { useBoolean } from '@/hooks'
import { getFileName, getResourceType } from '@/utils'
import { CloseOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material'

export type FileCardProps = {
  filePath: string
  onDelete?: () => void
  onClick?: () => void
}

export const FileCard = ({ filePath, onDelete, onClick }: FileCardProps) => {
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  return (
    <>
      <Card
        sx={{ display: 'flex', cursor: 'pointer', borderRadius: 3, alignItems: 'center' }}
        onClick={onClick}
        variant='outlined'
      >
        <CardContent
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1,
            overflow: 'hidden',
          }}
        >
          <Stack gap={1}>
            <Box component='img' src={getResourceType(filePath)} width={40} height={40} />
            <Typography textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' fontWeight={600}>
              {getFileName(filePath)}
            </Typography>
          </Stack>
        </CardContent>
        {onDelete && (
          <>
            <IconButton sx={{ mr: 1 }} onClick={openConfirm}>
              <CloseOutlined />
            </IconButton>
            <ConfirmPopup
              title='Confirm Action'
              subtitle='Are you sure you want to proceed with this action? This action cannot be undone. Please review your decision before confirming.'
              isOpen={isOpenConfirm}
              onClose={closeConfirm}
              onAccept={onDelete}
              type='delete'
            />
          </>
        )}
      </Card>
    </>
  )
}
