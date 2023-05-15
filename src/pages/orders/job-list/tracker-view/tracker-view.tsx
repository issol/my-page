import { Box, Grid, Switch, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import Filters from './filter'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { useGetJobsList, useGetJobsTrackerList } from '@src/queries/jobs.query'
import { ClientRowType } from '@src/apis/client.api'
import JobsTrackerList from './list'

export type FilterType = {
  client?: string[]
  category?: string[]
  serviceType?: string[]
  search?: string //filter for Work name, Project name
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

type Props = {
  clients: Array<ClientRowType>
}
export default function JobTrackerView({ clients }: Props) {
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    Array<ConstType>
  >([])

  const { data: list, isLoading } = useGetJobsTrackerList(activeFilter)

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
    const category =
      filter.category
        ?.map(item => ServiceTypePair[item as keyof typeof ServiceTypePair])
        .filter(item => item !== undefined)
        .flat() || []

    const uniqueCategory = category.filter(
      (item, index, self) =>
        index === self.findIndex(i => i.value === item.value),
    )

    return uniqueCategory.length ? uniqueCategory : ServiceTypeList
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
          clients={clients}
        />
      </Grid>

      <Grid item xs={12}>
        <JobsTrackerList
          isLoading={isLoading}
          list={list || { data: [], totalCount: 0 }}
          pageSize={activeFilter.take}
          skip={skip}
          setSkip={(n: number) => {
            setSkip(n)
            setActiveFilter({ ...activeFilter, skip: n * activeFilter.take! })
          }}
          setPageSize={(n: number) =>
            setActiveFilter({ ...activeFilter, take: n })
          }
        />
      </Grid>
    </Fragment>
  )
}
