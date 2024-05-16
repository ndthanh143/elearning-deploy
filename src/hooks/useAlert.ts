import { AlertType, useAlertStore } from '@/store'

export const useAlert = () => {
  const showAlert = useAlertStore((state) => state.showAlert)
  const hideAlert = useAlertStore((state) => state.hideAlert)

  const triggerAlert = (message?: string, type?: AlertType, timeout?: number) => {
    showAlert(message || '', type || 'success')
    setTimeout(() => {
      hideAlert()
    }, timeout || 3000)
  }

  return { triggerAlert }
}
