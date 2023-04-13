import { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import ClientListFilter from './list/filters'
import { useGetClientList } from '@src/queries/client.query'
import ClientList from './list/list'

export type FilterType = {
  status?: Array<string>
  search?: string
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  status: [],
  search: '',
  skip: 0,
  take: 10,
}

export default function Clients() {
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const { data: list, isLoading } = useGetClientList(activeFilter)

  function onSearch() {
    setActiveFilter({ ...filter })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  return (
    <Grid container spacing={6}>
      <PageHeader title={<Typography variant='h5'>Client list</Typography>} />
      <ClientListFilter
        filter={filter}
        onReset={onReset}
        search={onSearch}
        setFilter={setFilter}
      />

      <ClientList
        skip={skip}
        pageSize={activeFilter.take}
        setSkip={(n: number) => {
          setSkip(n)
          setActiveFilter({ ...activeFilter, skip: n * activeFilter.take })
        }}
        setPageSize={(n: number) =>
          setActiveFilter({ ...activeFilter, take: n })
        }
        list={list || { data: [], count: 0 }}
        isLoading={isLoading}
      />
    </Grid>
  )
}

Clients.acl = {
  subject: 'client',
  action: 'read',
}
