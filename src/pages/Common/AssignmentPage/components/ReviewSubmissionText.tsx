import { ConfirmPopup, CustomModal, DangerouseLyRender } from '@/components'
import Editor from '@/components/ContentEditor/ContentEditor'
import { useBoolean } from '@/hooks'
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export type ReviewSubmissionTextProps = {
  content: string
  isOpen: boolean
  onClose: () => void
  onUpdate?: (value: string) => void
  noEdit?: boolean
}

export const ReviewSubmissionText = ({ content, isOpen, onClose, onUpdate, noEdit }: ReviewSubmissionTextProps) => {
  const { value: isUpdate, setTrue: openUpdate, setFalse: closeUpdate } = useBoolean(false)
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean(false)

  const [value, setValue] = useState(content)

  const handleSubmitUpdate = () => {
    onUpdate && onUpdate(value)
    closeConfirm()
    closeUpdate()
  }

  return (
    <>
      <CustomModal title='Review submission' isOpen={isOpen} onClose={onClose}>
        <Box>
          <Box overflow='scroll' height='80vh'>
            <Typography fontWeight={700} mb={0.5}>
              Content
            </Typography>
            {isUpdate ? (
              <Box height='100%'>
                <Editor value={value} onChange={setValue} />
              </Box>
            ) : (
              <Card variant='outlined'>
                <CardContent>
                  <DangerouseLyRender content={content} />
                </CardContent>
              </Card>
            )}
          </Box>
          {!noEdit && (
            <>
              <Divider />
              {isUpdate ? (
                <Stack direction='row' gap={2}>
                  <Button variant='outlined' fullWidth sx={{ marginTop: 2 }} onClick={closeUpdate}>
                    Cancel
                  </Button>
                  <Button variant='contained' fullWidth sx={{ marginTop: 2 }} onClick={openConfirm}>
                    Submit
                  </Button>
                </Stack>
              ) : (
                <Button variant='contained' fullWidth sx={{ marginTop: 2 }} onClick={openUpdate}>
                  Update
                </Button>
              )}
            </>
          )}
        </Box>
      </CustomModal>
      <ConfirmPopup
        title='Confirm update'
        subtitle='Are you sure to confirm update your new submission?'
        isOpen={isOpenConfirm}
        onClose={closeConfirm}
        onAccept={handleSubmitUpdate}
      />
    </>
  )
}
