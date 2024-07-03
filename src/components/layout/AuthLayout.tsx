import { useAuth } from '@/hooks'
import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flex, Loading } from '..'

export function AuthLayout({ children }: PropsWithChildren) {
  const { profile, isFetched, accessToken, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { state } = useLocation()

  useEffect(() => {
    if (profile) {
      const url = state && state.from ? state.from : profile.data.role === 'Student' ? '/home' : '/courses'
      navigate(url)
    }
  }, [profile, isAuthenticated])

  return (isFetched && !profile) || !accessToken ? (
    children
  ) : (
    <Flex justifyContent='center' width='100vw' height='100vh'>
      <Loading />
    </Flex>
  )
}
