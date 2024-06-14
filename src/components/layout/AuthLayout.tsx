import { useAuth } from '@/hooks'
import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Loading } from '..'

export function AuthLayout({ children }: PropsWithChildren) {
  const { profile, isFetched, accessToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      const url = profile.data.role === 'Student' ? '/home' : '/courses'
      navigate(url)
    }
  }, [profile])

  return (isFetched && !profile) || !accessToken ? (
    children
  ) : (
    <Flex justifyContent='center' width='100vw' height='100vh'>
      <Loading />
    </Flex>
  )
}
