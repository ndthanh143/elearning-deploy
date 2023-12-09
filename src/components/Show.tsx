import { ReactNode } from 'react'

export type ShowProps = {
  when: boolean
  children: ReactNode
}

export const Show = ({ when, children }: ShowProps) => {
  return when && <>{children}</>
}
