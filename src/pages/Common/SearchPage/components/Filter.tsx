import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeftRounded } from '@mui/icons-material'
import { Card, CardContent, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'

import { Flex } from '@/components'
import { categoryKeys } from '@/services/category/category.query'

export function Filter() {
  const categoryInstance = categoryKeys.autoComplete()
  const { data: categories } = useQuery({ ...categoryInstance, select: (data) => data.content })

  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoryId = Number(event.target.id)
    setSelectedCategories((prev) =>
      event.target.checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId),
    )
  }

  useEffect(() => {
    searchParams.delete('category')
    selectedCategories.forEach((category) => {
      searchParams.append('category', category.toString())
    })
    setSearchParams(searchParams)
  }, [selectedCategories, searchParams, setSearchParams])

  return (
    <Card>
      <CardContent>
        <Stack gap={2}>
          <Flex justifyContent='space-between'>
            <Typography fontWeight={700}>Category</Typography>
            <ChevronLeftRounded sx={{ rotate: '-90deg' }} />
          </Flex>
          <Stack gap={0.5}>
            {categories?.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    id={category.id.toString()}
                    value={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCheckboxChange}
                  />
                }
                label={
                  <Typography variant='body2' fontWeight={400}>
                    {category.categoryName}
                  </Typography>
                }
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
