import { Box } from '@mui/material'
import { About, Branding, Features, Footer, OutStanding } from './components'

export function LandingPage() {
  return (
    <Box>
      <Branding />
      {/* <ColabSlide /> */}
      <OutStanding />
      <About />
      <Features />
      <Footer />
    </Box>
  )
}
