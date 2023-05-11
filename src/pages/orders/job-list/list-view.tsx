import { Grid } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import Filters from './filter'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'

export type FilterType = {
  status?: string[]
  client?: string[]
  category?: string[]
  serviceType?: string[]
  jobStartDateStart?: Date | null
  jobStartDateEnd?: Date | null
  jobDueDateStart?: Date | null
  jobDueDateEnd?: Date | null
  search?: string //filter for Work name, Project name
  mine?: boolean
  hidePaidJobs?: boolean
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  status: [],
  client: [],
  category: [],
  serviceType: [],
  jobStartDateStart: null,
  jobStartDateEnd: null,
  jobDueDateStart: null,
  jobDueDateEnd: null,
  search: '',
  mine: false,
  hidePaidJobs: false,
  skip: 0,
  take: 10,
}

export default function JobListView() {
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    Array<ConstType>
  >([])

  const data = {
    data: [],
    count: 0,
  }
  const isLoading = false
  //   const { data: list, isLoading } = useGetClientList(activeFilter)

  useEffect(() => {
    const newFilter = findServiceTypeFilter()
    setServiceTypeOptions(newFilter)
    if (newFilter.length)
      setFilter({
        ...filter,
        serviceType: newFilter
          .filter(item => filter.serviceType?.includes(item.value))
          .map(item => item.value),
      })
  }, [filter.category])

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

  return (
    <Fragment>
      <Grid item xs={12}>
        <Filters
          filter={filter}
          onReset={onReset}
          onSearch={onSearch}
          setFilter={setFilter}
          serviceTypeOptions={serviceTypeOptions}
        />
      </Grid>
    </Fragment>
  )
}
