import { Box, Button, Chip, Modal, Stack, TextField, Typography } from '@mui/material'
import { BoxContent, Dropzone, Flex, Link } from '@/components'
import { AddOutlined, DoNotDisturbAltOutlined, SendOutlined } from '@mui/icons-material'
import { useAlert } from '@/hooks'
import { useEffect, useState } from 'react'
import { object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import { regexPattern } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { teacherService } from '@/services'

type ModalAddStudentToCourseProps = {
  isOpen: boolean
  onClose: () => void
  courseId: number
}
const schema = object({
  email: string().matches(regexPattern.emailValidation, 'Please invalid correct email').required('Please type email'),
})
export const ModalAddStudentToCourse = ({ isOpen, courseId, onClose }: ModalAddStudentToCourseProps) => {
  const { triggerAlert } = useAlert()
  const [type, setType] = useState<'add' | 'upload'>('add')

  const [emails, setEmails] = useState<string[]>([])
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm({ resolver: yupResolver(schema) })

  const { mutate: mutateInviteStudents } = useMutation({
    mutationFn: teacherService.inviteStudentsToCourse,
    onSuccess: () => {
      onClose()
      setEmails([])
      triggerAlert('Invite students successfully', 'success')
    },
  })

  const handleRemoveEmail = (email: string) => () => setEmails((prev) => prev.filter((e) => e !== email))

  const handleAddEmail = ({ email }: { email: string }) => {
    if (isValid) {
      setEmails((prev) => [...prev, email])
      reset()
    }
  }

  const handleAddMember = (value: string) => {
    const arrEmail = value.trim().split(/[\s,;]+/)
    const emailData: string[] = []
    for (const email of arrEmail) {
      const trimmedEmail = email.trim().toLowerCase()

      if (regexPattern.emailValidation.test(trimmedEmail)) {
        emailData.push(trimmedEmail)
      }
    }
    setEmails(emailData)
    return true
  }

  const handleFileChange = (file: File) => {
    try {
      if (file) {
        const reader = new FileReader()
        reader.onload = (evt: ProgressEvent<FileReader>) => {
          /* Parse data */
          const bstr = evt.target?.result
          const wb = XLSX.read(bstr, { type: 'binary' })
          /* Get first worksheet */
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname ?? '']
          /* Convert array of arrays */
          if (ws) {
            const data = XLSX.utils.sheet_to_csv(ws)
            if (handleAddMember(data)) toast.success('Tải tệp thành công')
            else toast.error('Tải tệp thất bại')
          }
        }
        reader.readAsArrayBuffer(file)
      }
    } catch (error) {
      toast.error('Tải tệp thất bại')
    }
  }

  const handleInvites = () => {
    mutateInviteStudents({ courseId, emails })
  }

  const handleClose = () => {
    setType('add')
    setEmails([])
    reset()
    onClose()
  }

  useEffect(() => {
    if (emails.includes(watch('email'))) {
      setError('email', {
        type: 'validate',
        message: 'Email already exists',
      })
    }
  }, [watch(), setError])

  return (
    <Modal open={isOpen} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent minWidth={800} maxWidth='70vw' maxHeight='100vh' sx={{ overflowY: 'scroll' }}>
        <Typography variant='h3'>Add student</Typography>
        <Stack mt={2} gap={4}>
          <Flex gap={2}>
            <Chip
              variant={type === 'add' ? 'filled' : 'outlined'}
              label='Add student'
              sx={{ width: '100%', cursor: 'pointer', py: 2.5, fontWeight: 500 }}
              color={type === 'add' ? 'primary' : 'default'}
              onClick={() => setType('add')}
            />
            <Chip
              variant={type === 'upload' ? 'filled' : 'outlined'}
              label='Upload file'
              sx={{ width: '100%', cursor: 'pointer', py: 2.5, fontWeight: 500 }}
              color={type === 'upload' ? 'primary' : 'default'}
              onClick={() => setType('upload')}
            />
          </Flex>
          {type === 'add' ? (
            <Box component='form' display='flex' gap={1} onSubmit={handleSubmit(handleAddEmail)}>
              <Box position='relative' width='80%'>
                <TextField fullWidth size='small' placeholder='Type your student email...' {...register('email')} />
                {errors.email && (
                  <Typography
                    variant='caption'
                    color='error'
                    sx={{ display: 'block', position: 'absolute', bottom: -20, left: 4 }}
                  >
                    {errors.email.message}
                  </Typography>
                )}
              </Box>
              <Button variant='contained' type='submit' sx={{ width: '20%' }}>
                <AddOutlined fontSize='small' /> Add
              </Button>
            </Box>
          ) : (
            <Stack gap={0.5}>
              <Flex justifyContent='space-between'>
                <Typography>Upload file</Typography>
                <Link href='/enter-multi-email-template.xlsx' target='_blank' sx={{ textDecoration: 'none' }}>
                  Download template file
                </Link>
              </Flex>
              <Dropzone onFileChange={handleFileChange} />
            </Stack>
          )}
          <Stack>
            <Typography variant='body1' mb={0.5}>
              Emails will be invitated
            </Typography>
            <Flex
              alignItems='start'
              gap={2}
              flexWrap='wrap'
              border={1}
              borderColor='#e6e6e6'
              borderRadius={3}
              py={2}
              px={2}
              minHeight={150}
            >
              {emails.map((email) => (
                <Chip label={email} onDelete={handleRemoveEmail(email)} key={email} />
              ))}
            </Flex>
          </Stack>
          <Flex gap={2} mt={2}>
            <Button
              fullWidth
              variant='outlined'
              sx={{ display: 'flex', gap: 1 }}
              color='secondary'
              onClick={handleClose}
            >
              <DoNotDisturbAltOutlined fontSize='small' />
              Cancel
            </Button>
            <Button
              fullWidth
              variant='contained'
              sx={{ display: 'flex', gap: 1 }}
              onClick={handleInvites}
              disabled={emails.length === 0}
            >
              Send
              <SendOutlined fontSize='small' />
            </Button>
          </Flex>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
