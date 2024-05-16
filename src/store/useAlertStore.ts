import { create } from 'zustand'

export type AlertType = 'success' | 'info' | 'error'
type AlertState = {
  show: boolean
  message: string
  type?: AlertType
}

interface AlertStoreState {
  alert: AlertState
  showAlert: (message: string, type: AlertType) => void
  hideAlert: () => void
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  alert: { show: false, message: '', type: 'success' },
  showAlert: (message, type = 'info') => set({ alert: { show: true, message, type } }),
  hideAlert: () => set({ alert: { show: false, message: '' } }),
}))
