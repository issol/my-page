import { Box, Switch, Typography } from '@mui/material'
import Filters from './list/filter'

import { MouseEvent, useEffect, useState } from 'react'
import {
  useGetServiceType,
  useGetSimpleClientList,
} from '@src/queries/common.query'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useGetLinguistTeam } from '@src/queries/pro/linguist-team'
import LinguistTeamLayout from './list/layout'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'

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
  take: 10,
}

const LinguistTeam = () => {
  const savedFilter: FilterType | null = getUserFilters(
    FilterKey.LINGUIST_TEAM_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.LINGUIST_TEAM_LIST)!)
    : null

  const [menu, setMenu] = useState<MenuType>('card')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null)
  const [defaultFilter, setDefaultFilter] = useState<FilterType>(initialFilter)
  const [linguistTeamPage, setLinguistTeamPage] = useState<number>(0)

  const [seeMyTeams, setSeeMyTeams] = useState<boolean>(false)

  const languageList = getGloLanguage()
  const { data: serviceTypeList } = useGetServiceType()
  const { data: linguistList, isLoading } = useGetLinguistTeam(activeFilter)
  const { data: clientList } = useGetSimpleClientList()

  const onSearch = () => {
    if (activeFilter) {
      setActiveFilter({
        ...filter,
        // skip: filter.skip * activeFilter.take,
        // take: activeFilter.take,
      })
      saveUserFilters(FilterKey.LINGUIST_TEAM_LIST, { ...filter })
      setDefaultFilter({ ...filter })
    }
  }

  const onReset = () => {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    saveUserFilters(FilterKey.LINGUIST_TEAM_LIST, { ...initialFilter })
  }

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (savedFilter) {
      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        setFilter(savedFilter)
        setActiveFilter(savedFilter)

        setSeeMyTeams(savedFilter.mine === '1')
      }
    } else {
      setFilter(initialFilter)
      setActiveFilter(initialFilter)
    }
  }, [savedFilter])

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
            checked={seeMyTeams}
            onChange={e => {
              setSeeMyTeams(e.target.checked)
              setActiveFilter({
                ...activeFilter!,
                mine: e.target.checked ? '1' : '0',
              })
              saveUserFilters(FilterKey.LINGUIST_TEAM_LIST, {
                ...defaultFilter,
                mine: e.target.checked ? '1' : '0',
              })
            }}
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        {linguistList && clientList ? (
          <LinguistTeamLayout
            menu={menu}
            setMenu={setMenu}
            serviceTypeList={serviceTypeList || []}
            skip={activeFilter?.skip ?? 0}
            pageSize={activeFilter?.take ?? 10}
            setPageSize={(n: number) =>
              setActiveFilter({ ...activeFilter!, take: n })
            }
            page={linguistTeamPage}
            setPage={(n: number) => {
              setLinguistTeamPage(n)
              setActiveFilter({
                ...activeFilter!,
                skip: n * (activeFilter?.take! ?? 10),
              })
            }}
            handleMenuClick={handleMenuClick}
            handleMenuClose={handleMenuClose}
            anchorEl={anchorEl}
            clientList={clientList}
            activeFilter={activeFilter!}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default LinguistTeam
