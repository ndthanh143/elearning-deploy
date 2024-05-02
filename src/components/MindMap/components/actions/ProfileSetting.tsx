import { Flex } from '@/components'
import { useAuth, useBoolean, useMenu } from '@/hooks'
import { unitKey } from '@/services/unit/query'
import { Unit } from '@/services/unit/types'
import { gray } from '@/styles/theme'
import { CloseOutlined, MoreHorizOutlined, SearchOutlined } from '@mui/icons-material'
import { Box, Divider, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'

export function ProfileSetting({ lessonPlanId }: { lessonPlanId: number }) {
  const { profile } = useAuth()
  const { anchorEl: anchorElMore, isOpen, onClose, onOpen } = useMenu()
  const { fitView } = useReactFlow()

  const { value: isSearchOpen, setTrue: openSearch, setFalse: closeSearch } = useBoolean(false)
  const [searchValue, setSearchValue] = useState('')

  const searchDebounce = debounce((value: string) => {
    setSearchValue(value)
  }, 300)

  const searchUnitInstance = unitKey.search({ q: searchValue, lessonPlanId: Number(lessonPlanId) })
  const {
    data: units,
    isFetched: isFetchedUnits,
    refetch: refetchUnits,
  } = useQuery({ ...searchUnitInstance, enabled: Boolean(searchValue) })

  const renderModals = () => {
    return (
      <Menu
        open={isOpen}
        anchorEl={anchorElMore}
        onClose={onClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          paper: {
            style: {
              marginTop: 10,
            },
          },
        }}
      >
        {/* <MenuList>
          <MenuItem>
            <ListItemIcon>
              <EditOutlined />
            </ListItemIcon>
            <ListItemText>Edit this plan</ListItemText>
          </MenuItem>
        </MenuList>
        <Divider />
        <MenuList>
          <MenuItem sx={{ color: 'error.main' }}>Delete this plan</MenuItem>
        </MenuList> */}
      </Menu>
    )
  }

  const handleClickUnit = (unit: Unit) => {
    fitView({
      nodes: [{ id: unit.id.toString() }],
      duration: 500,
      minZoom: 1,
      maxZoom: 1,
    })
  }

  useEffect(() => {
    if (Boolean(searchValue)) {
      refetchUnits()
    }
  }, [searchDebounce])

  return (
    profile && (
      <>
        <Box
          component={motion.div}
          animate={{ scale: !isSearchOpen ? 1 : 0, opacity: !isSearchOpen ? 1 : 0 }}
          position='absolute'
          borderRadius={4}
          bgcolor='white'
          sx={{ boxShadow: 1 }}
          display='flex'
          alignItems='center'
          gap={1}
          top={10}
          px={2}
          py={0.2}
          right={20}
          zIndex={10}
        >
          <IconButton onClick={openSearch} color='secondary'>
            <SearchOutlined fontSize='small' />
          </IconButton>

          <Divider orientation='vertical' flexItem />

          <IconButton color='secondary' onClick={onOpen}>
            <MoreHorizOutlined />
          </IconButton>
        </Box>
        <Box
          component={motion.div}
          animate={{ scale: isSearchOpen ? 1 : 0, opacity: isSearchOpen ? 1 : 0 }}
          position='absolute'
          borderRadius={4}
          bgcolor='white'
          border={1}
          borderColor='#ededed'
          alignItems='center'
          top={10}
          px={2}
          right={20}
          zIndex={10}
          maxWidth={300}
        >
          <Flex gap={1} py={1}>
            <SearchOutlined fontSize='small' />
            <InputBase
              size='small'
              placeholder='Search'
              sx={{ color: gray[700], fontSize: 16 }}
              fullWidth
              onChange={(e) => searchDebounce(e.target.value)}
            />
            <IconButton sx={{ bgcolor: gray[50] }} size='small' onClick={closeSearch}>
              <CloseOutlined fontSize='small' />
            </IconButton>
          </Flex>
          <Divider />
          <Box py={1}>
            {searchValue &&
              units &&
              units.content.length > 0 &&
              units.content.map((unit) => (
                <MenuItem onClick={() => handleClickUnit(unit)}>
                  <Typography
                    variant='body2'
                    maxWidth='100%'
                    sx={{
                      display: 'block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      lineClamp: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {unit.name}
                  </Typography>
                </MenuItem>
              ))}
            {!searchValue && (
              <Typography variant='body2' color='secondary.light' sx={{ userSelect: 'none' }}>
                Did you know that you can search your topic, title, content
              </Typography>
            )}
            {isFetchedUnits && !units?.content.length && (
              <Typography variant='body2' color='secondary.light' sx={{ userSelect: 'none' }}>
                No results for "{searchValue}".
              </Typography>
            )}
          </Box>
        </Box>
        {renderModals()}
      </>
    )
  )
}
