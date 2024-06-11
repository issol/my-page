import { useEffect, useState } from 'react'
import { Box, Grid, Switch, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import ClientListFilter from './list/filters'
import { useGetClientList } from '@src/queries/client.query'
import ClientList from './list/list'
import { useQueryClient } from 'react-query'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'
import { hide } from '@popperjs/core'

export type FilterType = {
  status?: Array<string>
  search?: string
  hideBlocked?: boolean
  ordering?: 'desc' | 'asc'
  sort?: 'name' | 'corporationId' | 'createdAt'
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  status: [],
  search: '',
  hideBlocked: false,
  skip: 0,
  take: 10,
}

export default function Clients() {
  const queryClient = useQueryClient()

  const savedFilter: FilterType | null = getUserFilters(FilterKey.CLIENT_LIST)
    ? JSON.parse(getUserFilters(FilterKey.CLIENT_LIST)!)
    : null

  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null)

  const [defaultFilter, setDefaultFilter] = useState<FilterType>(initialFilter)
  const [hideBlocked, setHideBlocked] = useState<boolean>(false)
  const { data: list, isLoading } = useGetClientList(activeFilter)

  function onSearch() {
    setActiveFilter({
      ...filter,
    })
    saveUserFilters(FilterKey.CLIENT_LIST, { ...filter })
    setDefaultFilter({ ...filter })
    // queryClient.invalidateQueries([
    //   'get-client/list',
    //   { ...filter, skip: skip * activeFilter.take, take: activeFilter.take },
    // ])
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    saveUserFilters(FilterKey.CLIENT_LIST, {
      ...initialFilter,
      hideBlocked: hideBlocked,
    })
    queryClient.invalidateQueries(['get-client/list', { ...initialFilter }])
  }

  useEffect(() => {
    queryClient.invalidateQueries(['get-client/list'])
    queryClient.invalidateQueries(['client-detail'])
    queryClient.invalidateQueries(['client-projects'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        setFilter(savedFilter)
        setActiveFilter(savedFilter)
        setHideBlocked(savedFilter.hideBlocked ? true : false)
      }
    } else {
      setFilter(initialFilter)
      setActiveFilter(initialFilter)
    }
  }, [savedFilter])

  return (
    <Grid container spacing={6}>
      <PageHeader title={<Typography variant='h5'>Client list</Typography>} />
      <ClientListFilter
        filter={filter}
        onReset={onReset}
        search={onSearch}
        setFilter={setFilter}
      />

      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <Box>
          <Typography component='label' htmlFor='hideBlocked'>
            Hide blocked client
          </Typography>
          <Switch
            id='hideBlocked'
            checked={hideBlocked}
            onChange={e => {
              setHideBlocked(e.target.checked)
              setActiveFilter({
                ...activeFilter!,
                hideBlocked: e.target.checked,
              })
              saveUserFilters(FilterKey.CLIENT_LIST, {
                ...defaultFilter,
                hideBlocked: e.target.checked,
              })
            }}
          />
        </Box>
      </Grid>

      <ClientList
        skip={skip}
        pageSize={activeFilter?.take ?? 10}
        setSkip={(n: number) => {
          setSkip(n)
          setActiveFilter({
            ...activeFilter!,
            skip: n * (activeFilter?.take ?? 10),
          })
        }}
        setPageSize={(n: number) =>
          setActiveFilter({ ...activeFilter!, take: n })
        }
        list={list || { data: [], count: 0, totalCount: 0 }}
        isLoading={isLoading}
      />
    </Grid>
  )
}

Clients.acl = {
  subject: 'client',
  action: 'read',
}
