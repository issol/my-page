import { useEffect, useState } from 'react'

// ** mui
import { Grid, Typography } from '@mui/material'

// ** components
import PageHeader from '@src/@core/components/page-header'
import Filters from '../components/client-guideline/filter'
import ClientGuideLineList from '../components/client-guideline/list'

// ** fetch
import { useGetGuideLines } from '@src/queries/client-guideline.query'

// **values
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import FallbackSpinner from '@src/@core/components/spinner'
import { useQueryClient } from 'react-query'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'

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
  const queryClient = useQueryClient()

  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const savedFilter: FilterType | null = getUserFilters(
    FilterKey.CLIENT_GUIDELINE_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.CLIENT_GUIDELINE_LIST)!)
    : null

  const [defaultFilter, setDefaultFilter] = useState<FilterType>(initialFilter)

  const [serviceType, setServiceType] = useState<Array<ConstType>>([])
  const auth = useRecoilValueLoadable(authState)

  const { data: list, isLoading } = useGetGuideLines(activeFilter)

  function onSearch() {
    setActiveFilter({
      ...filter,
    })
    saveUserFilters(FilterKey.CLIENT_GUIDELINE_LIST, { ...filter })
    setDefaultFilter({ ...filter })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    saveUserFilters(FilterKey.CLIENT_GUIDELINE_LIST, { ...initialFilter })
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

  useEffect(() => {
    queryClient.invalidateQueries(['get-guideline'])
    queryClient.invalidateQueries(['get-guideline/detail'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        setFilter(savedFilter)
        setActiveFilter(savedFilter)
      }
    } else {
      setFilter(initialFilter)
      setActiveFilter(initialFilter)
    }
  }, [savedFilter])

  return (
    <>
      {auth.state === 'loading' ? (
        <FallbackSpinner />
      ) : auth.state === 'hasValue' ? (
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
            list={list || { data: [], count: 0, totalCount: 0 }}
            isLoading={isLoading}
            user={auth.getValue().user!}
            page={'onboarding'}
          />
        </Grid>
      ) : null}
    </>
  )
}

ClientGuidLines.acl = {
  action: 'read',
  subject: 'client_guideline',
}