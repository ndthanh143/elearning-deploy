import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import authService from '../services/auth/auth.service'
import { userKeys } from '../services/user/user.query'
import { useState } from 'react'
import { useBoolean } from '.'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const [accessToken, _] = useState(Cookies.get('access_token'))
  const { value: isAuthenticated, setTrue: setAuthenticated, setFalse: disableAuthenticated } = useBoolean()

  const userInstance = userKeys.profile()
  const { data: profile, isLoading, refetch, isFetched } = useQuery({ ...userInstance, enabled: Boolean(accessToken) })

  const logout = () => {
    authService.logout()
    disableAuthenticated()
    queryClient.setQueryData(userInstance.queryKey, null)
  }

  return { accessToken, profile, isLoading, refetch, isAuthenticated, setAuthenticated, isFetched, logout }
}
