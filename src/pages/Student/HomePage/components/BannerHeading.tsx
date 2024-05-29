import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { Button, Flex } from '@/components'
import { VerifiedUserRounded } from '@mui/icons-material'
import { primary } from '@/styles/theme'
import { orange } from '@mui/material/colors'

interface IBannerHeadingProps {
  title: string
  subtitle: string
  buttonLabel?: string
  rightIcon?: React.ReactNode
}

export function BannerHeading({ title, subtitle, buttonLabel, rightIcon }: IBannerHeadingProps) {
  return (
    <Card
      sx={{ background: `linear-gradient(to right, ${primary[500]}, ${orange[400]})`, color: 'white' }}
      elevation={1}
    >
      <CardContent>
        <Flex alignItems='center' justifyContent='space-between' gap={4}>
          <Stack gap={2}>
            <Chip
              sx={{ width: 'fit-content' }}
              label={
                <Flex gap={1}>
                  <VerifiedUserRounded fontSize='small' sx={{ color: 'white', width: 15, height: 15 }} />
                  <Typography variant='caption' fontWeight={700} color='primary.contrastText'>
                    Quotes
                  </Typography>
                </Flex>
              }
            />
            <Typography variant='h3' fontWeight={700} maxWidth={600}>
              {title}
            </Typography>
            <Typography variant='body2' color='primary.contrastText'>
              {subtitle}
            </Typography>
            {buttonLabel && (
              <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }}>
                {buttonLabel}
              </Button>
            )}
          </Stack>
          {rightIcon && <Box pr={8}>{rightIcon}</Box>}
        </Flex>
      </CardContent>
    </Card>
  )
}
