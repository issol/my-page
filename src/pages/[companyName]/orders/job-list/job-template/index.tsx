import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Filters from './filter'
import JobTemplateList from './list'
import { useGetJobTemplate } from '@src/queries/jobs/job-template.query'
import { useGetServiceType } from '@src/queries/common.query'
import { useRouter } from 'next/router'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'

export type FilterType = {
  serviceType?: number[]
  search?: string
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  serviceType: [],
  search: '',
  skip: 0,
  take: 10,
}

const JobTemplateView = () => {
  const savedFilter: FilterType | null = getUserFilters(
    FilterKey.JOB_TEMPLATE_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.JOB_TEMPLATE_LIST)!)
    : null

  const [defaultFilter, setDefaultFilter] = useState<FilterType>(initialFilter)

  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null)

  const { data, isLoading } = useGetJobTemplate(activeFilter)
  const { data: serviceTypeList } = useGetServiceType()

  const onSearch = () => {
    if (activeFilter) {
      setActiveFilter({
        ...filter,
        skip: filter.skip * activeFilter.take,
        take: activeFilter.take,
      })
      saveUserFilters(FilterKey.JOB_TEMPLATE_LIST, {
        ...filter,
        skip: filter.skip * activeFilter.take,
        take: activeFilter.take,
      })
      setDefaultFilter({
        ...filter,
        skip: filter.skip * activeFilter.take,
        take: activeFilter.take,
      })
    }
  }

  const onReset = () => {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    saveUserFilters(FilterKey.JOB_TEMPLATE_LIST, { ...initialFilter })
  }

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Filters
          filter={filter}
          setFilter={setFilter}
          onSearch={onSearch}
          onReset={onReset}
          serviceTypeList={serviceTypeList || []}
        />
      </Box>
      <Box width='100%'>
        <Card>
          <CardHeader
            title={
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>
                  Job Templates ({data ? data.totalCount.toLocaleString() : 0})
                </Typography>
                <Button
                  variant='contained'
                  onClick={() =>
                    router.push(
                      `/orders/job-list/job-template/form?mode=create`,
                    )
                  }
                >
                  Create new template
                </Button>
              </Box>
            }
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          ></CardHeader>
          <JobTemplateList
            list={data || { data: [], totalCount: 0 }}
            isLoading={isLoading}
            skip={filter.skip}
            pageSize={activeFilter?.take ?? 10}
            setSkip={(n: number) => {
              setFilter({ ...filter, skip: n })
              setActiveFilter({
                ...activeFilter!,
                skip: n * (activeFilter?.take ?? 10),
              })
            }}
            setPageSize={(n: number) =>
              setActiveFilter({ ...activeFilter!, take: n })
            }
            serviceTypeList={serviceTypeList || []}
          />
        </Card>
      </Box>
    </Box>
  )
}

export default JobTemplateView
