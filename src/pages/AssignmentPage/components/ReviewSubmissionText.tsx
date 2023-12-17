import { BoxContent, ConfirmPopup, DangerouseLyRender } from '@/components'
import Editor from '@/components/Editor'
import { useBoolean } from '@/hooks'
import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
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
      <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BoxContent
          width={{
            xs: '100%',
            md: '80%',
          }}
        >
          <Stack direction='row' justifyContent='space-between' pb={1}>
            <Typography variant='h5'>Your submission content</Typography>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider />

          <Box overflow='scroll' height='80vh'>
            {isUpdate ? (
              <Box height='100%'>
                <Editor value={value} onChange={setValue} />
              </Box>
            ) : (
              <DangerouseLyRender content={content} />
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
        </BoxContent>
      </Modal>
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
