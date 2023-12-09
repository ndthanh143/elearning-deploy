import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

import authService from '../services/auth/auth.service'
import { userKeys } from '../services/user/user.query'

export const useAuth = () => {
  const accessToken = Cookies.get('access_token')
  const queryClient = useQueryClient()

  const userInstance = userKeys.profile()
  const { data: profile, isLoading, refetch, isFetched } = useQuery({ ...userInstance, enabled: Boolean(accessToken) })

  const { mutate: mutateLoginGoogle } = useMutation({
    mutationFn: authService.loginGoogle,
    onSuccess: () => {
      toast.success('Login successfully!')
      refetch()
    },
  })
  const loginGoogle = async (accessToken: string) => mutateLoginGoogle(accessToken)

  const logout = () => {
    authService.logout()
    queryClient.setQueryData(userInstance.queryKey, null)
  }

  return { accessToken, profile, isLoading, refetch, isFetched, loginGoogle, logout }
}
