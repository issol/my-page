import { Box, Grid, Switch, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import Filters from './filter'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { useGetJobsList } from '@src/queries/jobs.query'
import JobsList from './list'

export type FilterType = {
  status?: string[]
  client?: string[]
  category?: string[]
  serviceType?: string[]
  startedAt: Array<Date | null>
  dueAt: Array<Date | null>
  search?: string //filter for Work name, Project name
  isMyJobs?: boolean
  isHidePaid?: boolean
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  status: [],
  client: [],
  category: [],
  serviceType: [],
  startedAt: [null, null],
  dueAt: [null, null],
  search: '',
  isMyJobs: false,
  isHidePaid: false,
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

  const { data: list, isLoading } = useGetJobsList(activeFilter)

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
        />
      </Grid>
      <Grid
        item
        xs={12}
        display='flex'
        gap='10px'
        alignItems='center'
        justifyContent='flex-end'
      >
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography>See only my jobs</Typography>
          <Switch
            checked={activeFilter.isMyJobs}
            onChange={e =>
              setActiveFilter({ ...activeFilter, isMyJobs: e.target.checked })
            }
          />
        </Box>
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography>Hide paid jobs</Typography>
          <Switch
            checked={activeFilter.isHidePaid}
            onChange={e =>
              setActiveFilter({
                ...activeFilter,
                isHidePaid: e.target.checked,
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <JobsList
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
