import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import { userKeys } from '../services/user/user.query'
import { useState } from 'react'
import { useBoolean } from '.'

export const useAuthAdmin = () => {
  const queryClient = useQueryClient()

  const [accessToken, _] = useState(Cookies.get('admin_access_token'))

  const { value: isAuthenticated, setTrue: setAuthenticated, setFalse: disableAuthenticated } = useBoolean()

  const userInstance = userKeys.adminProfile()
  const { data: profile, isLoading, refetch, isFetched } = useQuery({ ...userInstance, enabled: Boolean(accessToken) })

  const logout = () => {
    Cookies.remove('admin_access_token')
    disableAuthenticated()
    queryClient.setQueryData(userInstance.queryKey, null)
  }

  const login = () => {
    setAuthenticated()
    refetch()
  }

  return {
    accessToken,
    profile,
    isLoading,
    refetch,
    isAuthenticated,
    setAuthenticated,
    isFetched,
    logout,
    login,
  }
}
