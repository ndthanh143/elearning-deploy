import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import authService from '../services/auth/auth.service'
import { userKeys } from '../services/user/user.query'
import { useState } from 'react'
import { useActivityTracking, useBoolean } from '.'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const { handleOptOut } = useActivityTracking()

  const [accessToken, _] = useState(Cookies.get('access_token'))

  const { value: isAuthenticated, setTrue: setAuthenticated, setFalse: disableAuthenticated } = useBoolean()

  const userInstance = userKeys.profile()
  const { data: profile, isLoading, refetch, isFetched } = useQuery({ ...userInstance, enabled: Boolean(accessToken) })

  const logout = () => {
    handleOptOut()
    authService.logout()
    disableAuthenticated()
    queryClient.setQueryData(userInstance.queryKey, null)
  }

  const isStudent = profile?.data.role === 'Student'
  const isTeacher = profile?.data.role === 'Teacher'

  return {
    accessToken,
    profile,
    isLoading,
    refetch,
    isAuthenticated,
    setAuthenticated,
    isFetched,
    logout,
    isStudent,
    isTeacher,
  }
}
