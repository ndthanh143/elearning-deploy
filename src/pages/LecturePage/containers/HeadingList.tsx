import { BoxContent } from '@/components'
import { Link, Stack } from '@mui/material'
import { HeadingItem } from '../components'
import { useEffect, useState } from 'react'
import { isHeadingInViewport } from '@/utils'
import { useLocation } from 'react-router-dom'

export type Heading = {
  title: string
  id: string
  isActive?: boolean
}

export type HeadingListProps = {
  data: Heading[]
}

export const HeadingList = ({ data }: HeadingListProps) => {
  const { hash } = useLocation()

  const [headingList, setHeadingList] = useState<Heading[]>(data)

  const handleScrolling = () => {
    const modifiedList = data.map((heading) => ({
      ...heading,
      isActive: isHeadingInViewport(heading.id),
    }))

    setHeadingList(modifiedList)
  }

  useEffect(() => {
    window.addEventListener('scroll', () => handleScrolling())

    return window.removeEventListener('scroll', () => handleScrolling())
  }, [])

  useEffect(() => {
    const [_, id] = hash.split('#')

    const element = document.getElementById(id)
    element?.scrollIntoView()
  }, [])

  return (
    <BoxContent position='sticky' top={30}>
      <Stack gap={2}>
        {headingList.map((heading) => (
          <Link href={`#${heading.id}`} style={{ color: 'inherit', textDecoration: 'none' }} key={heading.id}>
            <HeadingItem title={heading.title} key={heading.title} isActive={heading.isActive} />
          </Link>
        ))}
      </Stack>
    </BoxContent>
  )
}
