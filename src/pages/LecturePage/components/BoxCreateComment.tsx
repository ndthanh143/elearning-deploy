import { Flex } from '@/components'
import { useOnClickOutside } from '@/hooks'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowUpwardOutlined, AttachFileOutlined } from '@mui/icons-material'
import { Box, IconButton, Input, Stack, Tooltip } from '@mui/material'
import { FormEvent, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

interface IBoxCreateCommentProps {
  onClose: () => void
  onSubmit: (data: { content: string }) => void
}

const schema = object({ content: string().required() })
export const BoxCreateComment = ({ onClose, onSubmit }: IBoxCreateCommentProps) => {
  const commentBoxRef = useRef<HTMLDivElement | null>(null)
  const { setValue, handleSubmit } = useForm({ resolver: yupResolver(schema) })

  useOnClickOutside(commentBoxRef, onClose)

  const handleInput = (event: FormEvent<HTMLDivElement>) => {
    const value = (event.target as HTMLDivElement).innerText
    setValue('content', value, { shouldValidate: true })
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      ref={commentBoxRef}
      p={2}
      my={1}
      border={1}
      borderColor='#ededed'
      borderRadius={2}
      gap={1}
      sx={{
        transition: 'all ease-in 0.05s',
      }}
    >
      <Stack gap={1}>
        <Box
          component='div'
          contentEditable
          sx={{ outline: 'none', maxWidth: '100%' }}
          onInput={handleInput}
          onBlur={handleInput}
        />
        <Flex justifyContent='end' gap={1}>
          <label htmlFor='attach-file'>
            <Tooltip title='Attach file'>
              <IconButton size='small'>
                <AttachFileOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </label>
          <Input type='file' id='attach-file' hidden sx={{ display: 'none' }} />
          <IconButton color='primary' size='small'>
            <ArrowUpwardOutlined fontSize='small' />
          </IconButton>
        </Flex>
      </Stack>
    </Box>
  )
}
