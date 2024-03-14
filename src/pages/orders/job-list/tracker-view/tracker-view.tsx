import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Switch,
  Typography,
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import Filters from './filter'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'

import { ClientRowType } from '@src/apis/client.api'
import JobsTrackerList from './list'
import { StyledNextLink } from '@src/@core/components/customLink'
import { useGetJobsTrackerList } from '@src/queries/jobs/jobs.query'

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
  onCreateNewJob: () => void
}
export default function JobTrackerView({ clients, onCreateNewJob }: Props) {
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    Array<ConstType>
  >([])

  const { data: list, isLoading } = useGetJobsTrackerList(activeFilter)

  // console.log(list)

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Filters
          filter={filter}
          onReset={onReset}
          onSearch={onSearch}
          setFilter={setFilter}
          serviceTypeOptions={serviceTypeOptions}
          clients={clients}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Card>
          <CardHeader
            title={
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>
                  Works ({list?.totalCount ?? 0})
                </Typography>{' '}
                <Button variant='contained' onClick={onCreateNewJob}>
                  Create new job
                </Button>
              </Box>
            }
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          ></CardHeader>
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
        </Card>
      </Box>
    </Box>
  )
}
