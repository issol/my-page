import { useEffect, useState } from 'react'

// ** mui
import { Grid, Typography } from '@mui/material'

// ** components
import PageHeader from 'src/@core/components/page-header'
import Filters from '../components/client-guideline/filter'
import ClientGuideLineList from '../components/client-guideline/list'

// ** fetch
import { useGetGuideLines } from 'src/queries/client-guideline.query'

// **values
import {
  ClientCategory,
  ServiceType,
  ServiceType2,
} from 'src/shared/const/clientGuideline'

import isEqual from 'lodash/isEqual'

export type ConstType = {
  label: string
  value: string
}

export type FilterType = {
  client?: Array<string>
  category?: Array<string>
  serviceType?: Array<string>
  title?: string
  content?: string
  skip: number
  pageSize: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'pageSize'>

export const initialFilter: FilterOmitType = {
  client: [],
  category: [],
  serviceType: [],
  title: '',
  content: '',
}
export default function ClientGuidLines() {
  const [filter, setFilter] = useState<FilterOmitType>({
    ...initialFilter,
  })
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)
  const [serviceType, setServiceType] = useState<Array<ConstType>>([])

  const {
    data: list,
    refetch,
    isLoading,
  } = useGetGuideLines({ ...filter, skip, pageSize }, search, setSearch)

  useEffect(() => {
    refetch()
  }, [skip, pageSize])

  function onReset() {
    setFilter({ ...initialFilter })
  }

  function findServiceTypeFilter() {
    let category: Array<ConstType> = []
    if (filter.category?.length) {
      filter.category.forEach(item => {
        if (!ServiceType2[item as keyof typeof ServiceType2]) return
        category = category.concat(
          ServiceType2[item as keyof typeof ServiceType2],
        )
      })
    }

    if (category?.length) {
      const result = category.reduce(
        (acc: Array<ConstType>, item: ConstType) => {
          const found = acc.find(ac => ac.value === item.value)
          if (!found) return acc.concat(item)
          return acc
        },
        [],
      )
      return result
    }
    return ServiceType
  }

  useEffect(() => {
    const newFilter = findServiceTypeFilter()
    setServiceType(newFilter)
    if (newFilter.length)
      setFilter({
        ...filter,
        serviceType: newFilter
          .filter(item => filter.serviceType?.includes(item.value))
          .map(item => item.value),
      })
  }, [filter.category])

  useEffect(() => {
    if (isEqual(initialFilter, filter)) {
      refetch()
    }
  }, [filter])

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Client guidelines</Typography>}
      />
      <Filters
        filter={filter}
        setFilter={setFilter}
        onReset={onReset}
        serviceType={serviceType}
        search={() => setSearch(true)}
      />
      <ClientGuideLineList
        pageSize={pageSize}
        setSkip={setSkip}
        setPageSize={setPageSize}
        list={list || { data: [], count: 0 }}
        isLoading={isLoading}
      />
    </Grid>
  )
}

ClientGuidLines.acl = {
  action: 'read',
  subject: 'client_guideline',
}
