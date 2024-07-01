import { primary } from '@/styles/theme'
import { SearchRounded } from '@mui/icons-material'
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { debounce } from 'lodash'
import { ChangeEvent, useCallback } from 'react'

import searchImg from '@/assets/images/searchPage/search-img.png'
import { Flex } from '@/components'

interface ISearchBarProps {
  onSearch: (value: string) => void
}

export function SearchBar({ onSearch }: ISearchBarProps) {
  const debounceSearch = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debounce(() => {
      onSearch(e.target.value)
    }, 300)
  }, [])

  return (
    <Box position='relative' bgcolor={'#fff'} borderRadius={4} p={4} boxShadow={2}>
      <Stack alignItems='center' gap={2}>
        <Box position='absolute' top={-35} p={1} bgcolor='#fff' borderRadius={'100%'}>
          <Box component='img' src={searchImg} width={60} height={60} />
        </Box>
        <Typography mb={0.5} fontWeight={700} variant='body1' textAlign='center' color={primary[700]} mt={2}>
          Explore newest courses on brainstone !
        </Typography>
        <Flex width='100%' gap={1}>
          <TextField
            fullWidth
            onChange={debounceSearch}
            placeholder='Search your courses..'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
          />
          <Button variant='contained' color='primary' size='large' sx={{ height: 56 }}>
            Search
          </Button>
        </Flex>
      </Stack>
    </Box>
  )
}
