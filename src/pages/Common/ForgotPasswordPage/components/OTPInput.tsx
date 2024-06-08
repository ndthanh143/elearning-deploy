import { ChangeEvent, KeyboardEvent, useRef } from 'react'
import { TextField, Grid } from '@mui/material'
import { Control, useController } from 'react-hook-form'
import { primary } from '@/styles/theme'

interface OTPInputProps {
  control: Control
  name: string
  length: number
  onComplete: (otp: string) => void
}

export const OTPInput = ({ control, name, length, onComplete }: OTPInputProps) => {
  const { field } = useController({ name, control, defaultValue: '' })

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null))

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const otp = e.target.value.replace(/[^0-9]/g, '')
    if (otp.length <= length) {
      const newValue = field.value.split('')
      newValue[index] = otp
      const newOtpValue = newValue.join('')
      field.onChange(newOtpValue)

      if (otp.length === 1 && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      if (newOtpValue.length === length) {
        onComplete(newOtpValue)
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Backspace' && !field.value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight') {
      if (index === length - 1) {
        return
      }
      inputRefs.current[index + 1]?.focus()
    }
    if (e.key === 'ArrowLeft') {
      if (index === 0) {
        return
      }
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <Grid container spacing={1} justifyContent='center'>
      {Array.from({ length }).map((_, index) => (
        <Grid item xs={2} key={index}>
          <TextField
            variant='outlined'
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 0,
                padding: '8px 16px',
                color: primary[600],
              },
            }}
            value={field.value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onBlur={field.onBlur}
            inputRef={(el) => (inputRefs.current[index] = el)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
