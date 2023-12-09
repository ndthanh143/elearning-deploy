import common from '@/assets/images/icons/common'
import { BoxContent } from '@/components'
import { UploadEnumType, UploadFileData } from '@/services/file/file.dto'
import { fileService } from '@/services/file/file.service'
import { CloseOutlined, FileUploadOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FileCard } from '.'

export type UploadPopupProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UploadFileData) => void
}

export const UploadPopup = ({ isOpen, onClose, onSubmit }: UploadPopupProps) => {
  const [file, setFile] = useState<any | null>(null)

  const {
    data: uploadData,
    mutate: mutateUpload,
    isPending: isLoadingUpload,
  } = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: fileService.upload,
  })

  const handleCancelSubmit = () => {
    setFile(null)
  }

  useEffect(() => {
    if (file) {
      mutateUpload({ file, type: UploadEnumType.SUBMISSION_FILE })
    }
  }, [file])

  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClose={onClose}>
      <BoxContent width='70%'>
        <Stack direction='row' justifyContent='space-between' mb={1}>
          <Stack direction='row' alignItems='center' gap={1}>
            <FileUploadOutlined fontSize='large' />
            <Typography variant='h5'>Upload your file</Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />
        <Stack alignItems='center' gap={4} justifyContent='center' py={10}>
          {uploadData && file ? (
            <FileCard filePath={uploadData.data.filePath} />
          ) : (
            <Box component='img' src={common.upload} width={150} />
          )}
          {file && uploadData ? (
            <>
              <Button variant='contained' onClick={() => onSubmit(uploadData.data)}>
                Submit
              </Button>
              <Button variant='outlined' onClick={handleCancelSubmit}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Box
                component='label'
                sx={{
                  cursor: 'pointer',
                  ':hover': {
                    bgcolor: 'primary.light',
                  },
                }}
                htmlFor='upload-file'
                px={3}
                py={1}
                bgcolor='primary.main'
                color='primary.contrastText'
                borderRadius={3}
              >
                {isLoadingUpload ? 'Loading...' : 'Upload'}
              </Box>
              <Box
                component='input'
                type='file'
                id='upload-file'
                multiple={false}
                sx={{ display: 'none' }}
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
              <Typography>Or drop your file here</Typography>
            </>
          )}
        </Stack>
      </BoxContent>
    </Modal>
  )
}
