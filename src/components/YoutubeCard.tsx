import { BoxProps, CardMedia } from '@mui/material'

export type YoutubeCardProps = BoxProps & {
  videoUrl: string
}
export const YoutubeCard = ({ videoUrl, ...props }: YoutubeCardProps) => {
  return (
    <CardMedia
      component='iframe'
      sx={{ borderRadius: 3 }}
      height={'315'}
      src={videoUrl}
      title='YouTube Video'
      allowFullScreen
      {...props}
    />
  )
}
