import { useContext, useEffect, useState } from 'react'

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
  ServiceTypeList,
  ServiceTypePair,
} from 'src/shared/const/service-type/service-types'

import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'

export type ConstType = {
  label: string
  value: string
}

export type FilterType = {
  client?: Array<string>
  category?: Array<string>
  serviceType?: Array<string>
  search?: string
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  client: [],
  category: [],
  serviceType: [],
  search: '',
  skip: 0,
  take: 10,
}
export default function ClientGuidLines() {
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const [serviceType, setServiceType] = useState<Array<ConstType>>([])
  const { user } = useRecoilValue(authState)

  const { data: list, isLoading } = useGetGuideLines(activeFilter)

  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  function findServiceTypeFilter() {
    let category: Array<ConstType> = []
    if (filter.category?.length) {
      filter.category.forEach(item => {
        if (!ServiceTypePair[item as keyof typeof ServiceTypePair]) return
        category = category.concat(
          ServiceTypePair[item as keyof typeof ServiceTypePair],
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
    return ServiceTypeList
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
        search={onSearch}
      />
      <ClientGuideLineList
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
        user={user!}
        page={'onboarding'}
      />
    </Grid>
  )
}

ClientGuidLines.acl = {
  action: 'read',
  subject: 'client_guideline',
}
