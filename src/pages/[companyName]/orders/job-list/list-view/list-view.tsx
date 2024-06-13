import { Fragment, useEffect, useMemo, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Switch,
  Typography,
} from '@mui/material'

// ** types
import Filters from './filter'
import { ConstType } from 'src/pages/[companyName]/onboarding/client-guideline'
import { ClientRowType } from '@src/apis/client.api'

// ** values
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'

// ** apis
// ** components
import JobsList from './list'

import { useGetJobsList } from '@src/queries/jobs/jobs.query'
import { convertLocalToUtc } from '@src/shared/helpers/date.helper'
import moment from 'moment'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { StatusItem } from '@src/types/common/status.type'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'
import { getCurrentRole } from '@src/shared/auth/storage'

export type FilterType = {
  status?: number[]
  client?: string[]
  category?: string[]
  serviceType?: string[]
  startedAt?: Array<string | null>
  dueAt?: Array<string | null>
  search?: string //filter for Work name, Project name
  isMyJobs?: '0' | '1'
  isHidePaid?: '0' | '1'
  skip: number
  take: number
}

export type FilterPostType = {
  status?: number[]
  client?: string[]
  category?: string[]
  serviceType?: string[]
  startedAt?: Array<string | null>
  dueAt?: Array<string | null>
  search?: string //filter for Work name, Project name
  isMyJobs?: '0' | '1'
  isHidePaid?: '0' | '1'
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

  skip: 0,
  take: 10,
}

type Props = {
  clients: Array<ClientRowType>
  onCreateNewJob: () => void
  statusList: Array<StatusItem>
}

export default function JobListView({
  clients,
  onCreateNewJob,
  statusList,
}: Props) {
  const user = useRecoilValueLoadable(authState)
  const currentRole = getCurrentRole()

  const [skip, setSkip] = useState(0)
  const savedFilter: FilterType | null = getUserFilters(FilterKey.JOB_LIST)
    ? JSON.parse(getUserFilters(FilterKey.JOB_LIST)!)
    : null

  const [defaultFilter, setDefaultFilter] = useState<FilterType>(initialFilter)

  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null)

  const [hidePaid, setHidePaid] = useState<boolean>(false)
  const [seeMyJob, setSeeMyJob] = useState<boolean>(false)

  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    Array<ConstType>
  >([])

  const { data: list, isLoading } = useGetJobsList(activeFilter)

  const userTimezone = useMemo(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return user.getValue().user?.timezone.label || browserTimezone
  }, [user])

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
    if (activeFilter) {
      const postFilter = {
        ...filter,
        skip: skip * activeFilter.take,
        take: activeFilter.take,
        startedAt: filter.startedAt?.map(item => {
          return item
            ? convertLocalToUtc(moment(item).format('YYYY-MM-DD'), userTimezone)
            : null
        }),
        dueAt: filter.dueAt?.map(item => {
          return item
            ? convertLocalToUtc(moment(item).format('YYYY-MM-DD'), userTimezone)
            : null
        }),
      }
      saveUserFilters(FilterKey.JOB_LIST, postFilter)
      setDefaultFilter(postFilter)
      setActiveFilter(postFilter)
    }
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    saveUserFilters(FilterKey.JOB_LIST, {
      ...initialFilter,
      isHidePaid: hidePaid ? '1' : '0',
      isMyJobs: seeMyJob ? '1' : '0',
    })
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

  useEffect(() => {
    if (savedFilter) {
      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        setFilter(savedFilter)
        setActiveFilter(savedFilter)
        setHidePaid(savedFilter.isHidePaid === '1')
        setSeeMyJob(savedFilter.isMyJobs === '1')
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
          clients={clients}
          onReset={onReset}
          onSearch={onSearch}
          setFilter={setFilter}
          serviceTypeOptions={serviceTypeOptions}
        />
      </Box>
      <Box
        display='flex'
        gap='10px'
        alignItems='center'
        justifyContent='flex-end'
        width='100%'
      >
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography>See only my jobs</Typography>
          <Switch
            checked={seeMyJob}
            onChange={e => {
              setSeeMyJob(e.target.checked)
              setActiveFilter({
                ...activeFilter!,
                isMyJobs: e.target.checked ? '1' : '0',
              })
              saveUserFilters(FilterKey.JOB_LIST, {
                ...defaultFilter,
                isMyJobs: e.target.checked ? '1' : '0',
              })
            }}
          />
        </Box>
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography>Hide paid jobs</Typography>
          <Switch
            checked={hidePaid}
            onChange={e => {
              setHidePaid(e.target.checked)
              setActiveFilter({
                ...activeFilter!,
                isHidePaid: e.target.checked ? '1' : '0',
              })
              saveUserFilters(FilterKey.JOB_LIST, {
                ...defaultFilter,
                isHidePaid: e.target.checked ? '1' : '0',
              })
            }}
          />
        </Box>
      </Box>

      <Box width='100%'>
        <Card>
          <CardHeader
            title={
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>
                  Jobs ({list?.totalCount ?? 0})
                </Typography>{' '}
                <Button
                  variant='contained'
                  onClick={onCreateNewJob}
                  disabled={currentRole?.name === 'TAD'}
                >
                  Create new job
                </Button>
              </Box>
            }
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          ></CardHeader>
          <JobsList
            isLoading={isLoading}
            list={list || { data: [], totalCount: 0 }}
            pageSize={activeFilter?.take ?? 10}
            skip={skip}
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
            statusList={statusList!}
          />
        </Card>
      </Box>
    </Box>
  )
}