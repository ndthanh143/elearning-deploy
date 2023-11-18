import { Typography } from '@mui/material'
import { useAuth } from '../hooks'
import dayjs from 'dayjs'

export type PageContentHeadingProps = {
  title?: string
  subTitle?: string
}

const currentDate = dayjs()
export const PageContentHeading = ({ title, subTitle }: PageContentHeadingProps) => {
  const { profile } = useAuth()

  return (
    <>
      <Typography variant='h5' fontWeight={700} my={2}>
        {title || `Welcome back, ${profile?.data.fullName}`}
      </Typography>
      <Typography variant='body2' marginBottom={4}>
        {subTitle || `Take a look your learning progress for Today, ${currentDate.format('MMMM DD YYYY')}`}
      </Typography>
    </>
  )
}
