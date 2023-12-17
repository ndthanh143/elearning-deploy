import { CircularProgress, Modal } from '@mui/material'

type ModalLoadingProps = {
  isOpen: boolean
}
export const ModalLoading = ({ isOpen }: ModalLoadingProps) => {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Modal>
  )
}
