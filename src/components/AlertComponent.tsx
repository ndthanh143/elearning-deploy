import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useAlertStore } from '@/store'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const AlertComponent: React.FC = () => {
  const { alert, hideAlert } = useAlertStore()

  return (
    <Snackbar open={alert.show} onClose={hideAlert}>
      <Alert severity={alert.type} sx={{ width: '100%' }}>
        {alert.message}
      </Alert>
    </Snackbar>
  )
}
