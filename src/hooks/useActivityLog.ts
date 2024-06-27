import { activityService } from '@/services'

const TRACKING_START_TIME_KEY = 'tracking_start_time'
export const useActivityTracking = () => {
  const handleSetTime = () => {
    const startTime = new Date().toISOString()
    localStorage.setItem(TRACKING_START_TIME_KEY, startTime)
  }

  const handleOptOut = async () => {
    const startTime = localStorage.getItem(TRACKING_START_TIME_KEY)
    if (startTime) {
      const endTime = new Date().toISOString()
      const payload = { startTime, endTime }
      try {
        await activityService.tracking(payload)
        console.log('Activity tracking data sent successfully')
        // Optionally, clear the start time from localStorage after sending the data
        localStorage.removeItem(TRACKING_START_TIME_KEY)
      } catch (error) {
        console.error('Failed to send activity tracking data', error)
      }
    } else {
      console.warn('Start time not found in localStorage')
    }
  }

  return { handleOptOut, handleSetTime }
}
