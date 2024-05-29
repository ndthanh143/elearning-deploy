import { InfoHeading, TableDataStudent } from './components'
import { Container } from '@mui/material'

export const StudentManagement = () => {
  return (
    <>
      <Container sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <InfoHeading />
        <TableDataStudent />
      </Container>
    </>
  )
}
