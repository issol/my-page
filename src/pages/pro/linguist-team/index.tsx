import { Box, Switch, Typography } from '@mui/material'
import Filters from './list/filter'

import { useMemo, useState } from 'react'
import { useGetServiceType } from '@src/queries/common.query'
import { useGetClientList } from '@src/queries/client.query'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useGetLinguistTeam } from '@src/queries/pro/linguist-team'
import LinguistTeamList from './list/list'
import { MenuType } from '..'

export type FilterType = {
  serviceType?: number[]
  source?: string | null
  target?: string | null
  clients?: string[]
  search?: string
  skip: number
  take: number
  seeMyTeams?: '0' | '1'
}

export const initialFilter: FilterType = {
  serviceType: [],
  source: null,
  target: null,
  seeMyTeams: '0',
  clients: [],
  search: '',
  skip: 0,
  take: 12,
}

type Props = {
  menu: MenuType
}

const LinguistTeam = ({ menu }: Props) => {
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const languageList = getGloLanguage()
  const { data: serviceTypeList } = useGetServiceType()
  const { data: linguistList } = useGetLinguistTeam(activeFilter)
  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })
  const clientList = useMemo(
    () => clientData?.data?.map(i => ({ label: i.name, value: i.name })) || [],
    [clientData],
  )

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box sx={{ width: '100%' }}>
        <Filters
          filter={filter}
          setFilter={setFilter}
          onSearch={onSearch}
          onReset={onReset}
          serviceTypeList={serviceTypeList || []}
          clientList={clientList}
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
            checked={activeFilter.seeMyTeams === '1'}
            onChange={e =>
              setActiveFilter({
                ...activeFilter,
                seeMyTeams: e.target.checked ? '1' : '0',
              })
            }
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <LinguistTeamList data={linguistList!} menu={menu} />
      </Box>
    </Box>
  )
}

export default LinguistTeam
