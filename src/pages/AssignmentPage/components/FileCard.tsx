import { ConfirmPopup } from '@/components'
import { useBoolean } from '@/hooks'
import { getFileName, getResourceType } from '@/utils'
import { CloseOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'

export type FileCardProps = {
  filePath: string
  onDelete?: () => void
  onClick?: () => void
}

export const FileCard = ({ filePath, onDelete, onClick }: FileCardProps) => {
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  return (
    <>
      <Card sx={{ display: 'flex', cursor: 'pointer', borderRadius: 3, alignItems: 'center' }} onClick={onClick}>
        {/* <CardMedia
          component='img'
          src={`${configs.API_URL}/api/file/download${filePath}` as string}
          sx={{ width: 120, height: 110 }}
        /> */}

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
          <Typography textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' mr={4}>
            {getFileName(filePath)}
          </Typography>
          <Box component='img' src={getResourceType(filePath)} width={30} height={30} />
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
            />
          </>
        )}
      </Card>
    </>
  )
}
