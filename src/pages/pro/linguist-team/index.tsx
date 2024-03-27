import { Box, Switch, Typography } from '@mui/material'
import Filters from './list/filter'

import { MouseEvent, useState } from 'react'
import {
  useGetServiceType,
  useGetSimpleClientList,
} from '@src/queries/common.query'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useGetLinguistTeam } from '@src/queries/pro/linguist-team'
import LinguistTeamLayout from './list/layout'

export type MenuType = 'card' | 'list'
export type FilterType = {
  serviceTypeId?: number[]
  sourceLanguage?: string | null
  targetLanguage?: string | null
  clientId?: number[]
  search?: string
  skip: number
  take: number
  mine?: '0' | '1'
}

export const initialFilter: FilterType = {
  serviceTypeId: [],
  sourceLanguage: null,
  targetLanguage: null,
  mine: '0',
  clientId: [],
  search: '',
  skip: 0,
  take: 12,
}

const LinguistTeam = () => {
  const [menu, setMenu] = useState<MenuType>('card')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const languageList = getGloLanguage()
  const { data: serviceTypeList } = useGetServiceType()
  const { data: linguistList, isLoading } = useGetLinguistTeam(activeFilter)
  const { data: clientList } = useGetSimpleClientList()

  const onSearch = () => {
    setActiveFilter({
      ...filter,
      skip: filter.skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  const onReset = () => {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box sx={{ width: '100%' }}>
        <Filters
          filter={filter}
          setFilter={setFilter}
          onSearch={onSearch}
          onReset={onReset}
          serviceTypeList={serviceTypeList || []}
          clientList={clientList || []}
          languageList={languageList}
        />
      </Box>
      <Box
        display='flex'
        gap='10px'
        alignItems='center'
        justifyContent='flex-end'
        width='100%'
      >
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography>View only my teams</Typography>
          <Switch
            checked={activeFilter.mine === '1'}
            onChange={e =>
              setActiveFilter({
                ...activeFilter,
                mine: e.target.checked ? '1' : '0',
              })
            }
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        {linguistList && clientList ? (
          <LinguistTeamLayout
            menu={menu}
            setMenu={setMenu}
            serviceTypeList={serviceTypeList || []}
            skip={activeFilter.skip}
            pageSize={activeFilter.take}
            setSkip={(n: number) => {
              setActiveFilter({ ...activeFilter, skip: n * activeFilter.take! })
            }}
            setPageSize={(n: number) =>
              setActiveFilter({ ...activeFilter, take: n })
            }
            handleMenuClick={handleMenuClick}
            handleMenuClose={handleMenuClose}
            anchorEl={anchorEl}
            clientList={clientList}
            activeFilter={activeFilter}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default LinguistTeam
