import { useEffect, useState } from 'react'
// ** mui imports
import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'

// ** third parties
import isEqual from 'lodash/isEqual'

// ** values
import { ProRolePair } from 'src/shared/const/role/roles'
import { ProJobPair } from 'src/shared/const/job/jobs'
import Filters from './components/filter'

// ** fetch
import { useGetJobPostingList } from 'src/queries/jobPosting.query'
import JobPostingList from './components/list'

export type FilterType = {
  jobType?: string
  role?: string
  yearsOfExperience?: string
  source?: string
  target?: string
  dueDate?: string | undefined
  skip?: number
  take?: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'take'>

export const initialFilter: FilterOmitType = {
  jobType: '',
  role: '',
  yearsOfExperience: '',
  source: '',
  target: '',
  dueDate: '',
}
export default function jobPosting() {
  type FilterState = Array<{ value: string; label: string }>
  const [filter, setFilter] = useState<FilterOmitType>({ ...initialFilter })
  const [jobTypeOption, setJobTypeOption] = useState<FilterState>([])
  const [roleOption, setRoleOption] = useState<FilterState>([])
  const [skip, setSkip] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)

  const {
    data: list,
    refetch,
    isLoading,
  } = useGetJobPostingList(
    { ...filter, skip: skip * pageSize, take: pageSize },
    search,
    setSearch,
  )

  function findDynamicFilterOptions(
    type: 'role' | 'jobType',
  ): Array<{ value: string; label: string }> {
    switch (type) {
      case 'jobType':
        const key = filter.jobType as keyof typeof ProRolePair
        return ProRolePair[key]?.length ? [...ProRolePair[key]] : []
      case 'role':
        const roleKey = filter.role as keyof typeof ProJobPair
        return ProJobPair[roleKey]?.length ? [...ProJobPair[roleKey]] : []
      default:
        return []
    }
  }

  useEffect(() => {
    const newFilter = findDynamicFilterOptions('jobType')
    setRoleOption(newFilter)
    if (newFilter.length && filter.role !== '') {
      const reset = newFilter.filter(role => role.value === filter.role)
      reset.length &&
        setFilter({
          ...filter,
          role: reset[0].value,
        })
    }
  }, [filter.jobType])

  useEffect(() => {
    const newFilter = findDynamicFilterOptions('role')
    setJobTypeOption(newFilter)
    if (newFilter.length && filter.jobType !== '') {
      const reset = newFilter.filter(
        jobType => jobType.value === filter.jobType,
      )
      reset.length &&
        setFilter({
          ...filter,
          jobType: reset[0].value,
        })
    }
  }, [filter.role])

  function onReset() {
    setFilter({ ...initialFilter })
  }

  useEffect(() => {
    if (isEqual(initialFilter, filter)) {
      refetch()
    }
  }, [filter])

  return (
    <Grid container spacing={6} className='match-height'>
      <PageHeader title={<Typography variant='h5'>Job posting</Typography>} />
      <Filters
        filter={filter}
        setFilter={setFilter}
        jobTypeOption={jobTypeOption}
        onReset={onReset}
        roleOption={roleOption}
        search={() => setSearch(true)}
      />
      <JobPostingList
        skip={skip}
        pageSize={pageSize}
        setSkip={setSkip}
        setPageSize={setPageSize}
        list={list || { data: [], count: 0 }}
        isLoading={isLoading}
      />
    </Grid>
  )
}

jobPosting.acl = {
  subject: 'job_posting',
  action: 'read',
}
