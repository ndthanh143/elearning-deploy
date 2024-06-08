import { BoxContent, Dropzone, Flex } from '@/components'
import { UploadEnumType, UploadFileData } from '@/services/file/file.dto'
import { fileService } from '@/services/file/file.service'
import { CloseOutlined, FileUploadRounded } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { getResourceType } from '@/utils'
import { icons } from '@/assets/icons'

export type UploadPopupProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UploadFileData) => void
}

export const UploadPopup = ({ isOpen, onClose, onSubmit }: UploadPopupProps) => {
  const [file, setFile] = useState<any | null>(null)

  const { mutate: mutateUpload } = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: fileService.upload,
    onSuccess: (data) => {
      onSubmit(data.data)
      onClose()
    },
  })

  const handleSubmit = () => {
    if (file) {
      mutateUpload({ file, type: UploadEnumType.SUBMISSION_FILE })
    }
  }

  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClose={onClose}>
      <BoxContent width='70%'>
        <Stack direction='row' justifyContent='space-between' mb={1}>
          <Stack direction='row' alignItems='center' gap={1}>
            <FileUploadRounded color='primary' />
            <Typography>Upload your file</Typography>
          </Stack>
          <IconButton onClick={onClose}>{icons['close']}</IconButton>
        </Stack>
        <Divider />
        <Stack alignItems='center' gap={4} justifyContent='center' py={2}>
          <Stack gap={2} width='100%'>
            <Dropzone onFileChange={(file) => setFile(file)} sx={{ py: 10 }} />
            {/* {uploadData && file && <FileCard filePath={uploadData.data.filePath} />} */}
            {file && (
              <Card variant='outlined'>
                <CardContent>
                  <Flex gap={2} position='relative'>
                    <Box component='img' src={getResourceType(file.name)} width={50} height={50} />
                    <Stack gap={0.5} mr={4}>
                      <Typography fontWeight={600}>{file.name}</Typography>
                      <Typography>{(file.size / 1024).toFixed(1)}KB</Typography>
                    </Stack>
                    <Box position='absolute' right={0} top='50%' sx={{ transform: 'translateY(-50%)' }}>
                      <IconButton onClick={() => setFile(null)}>{icons['close']}</IconButton>
                    </Box>
                  </Flex>
                </CardContent>
              </Card>
            )}
            <Button variant='contained' fullWidth onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
