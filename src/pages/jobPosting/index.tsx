import { useEffect, useState } from 'react'
// ** mui imports
import { Grid, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** values
import { ProRolePair } from '@src/shared/const/role/roles'
import { ProJobPair } from '@src/shared/const/job/jobs'
import Filters from './components/filter'

// ** fetch
import { useGetJobPostingList } from '@src/queries/jobs/jobPosting.query'
import JobPostingList from './components/list'
import { useQueryClient } from 'react-query'

export type FilterType = {
  jobType?: string
  role?: string
  yearsOfExperience?: string
  source?: string
  target?: string
  dueDate?: string | undefined
  skip?: number
  take?: number
  sort: string
  ordering: string
}

export const initialFilter: FilterType = {
  jobType: '',
  role: '',
  yearsOfExperience: '',
  source: '',
  target: '',
  dueDate: '',
  skip: 0,
  take: 10,
  sort: 'createdAt',
  ordering: 'DESC',
}
export default function jobPosting() {
  type FilterState = Array<{ value: string; label: string }>

  const queryClient = useQueryClient()
  const [jobTypeOption, setJobTypeOption] = useState<FilterState>([])
  const [roleOption, setRoleOption] = useState<FilterState>([])
  const [skip, setSkip] = useState(0)
  // const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const { data: list, isLoading } = useGetJobPostingList(activeFilter)

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

  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter?.take!,
      take: activeFilter.take,
    })
    queryClient.invalidateQueries(['get-jobPosting/list', activeFilter])
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    queryClient.invalidateQueries(['get-jobPosting/list', activeFilter])
  }

  useEffect(() => {
    queryClient.invalidateQueries(['get-jobPosting/list'])
  }, [])
  return (
    <Grid container spacing={6} className='match-height'>
      <PageHeader title={<Typography variant='h5'>Job posting</Typography>} />
      <Filters
        filter={filter}
        setFilter={setFilter}
        jobTypeOption={jobTypeOption}
        onReset={onReset}
        roleOption={roleOption}
        search={onSearch}
      />
      <JobPostingList
        skip={skip}
        pageSize={activeFilter.take!}
        setSkip={(n: number) => {
          setSkip(n)
          setActiveFilter({ ...activeFilter, skip: n * activeFilter.take! })
        }}
        setPageSize={(n: number) =>
          setActiveFilter({ ...activeFilter, take: n })
        }
        list={list || { data: [], totalCount: 0 }}
        isLoading={isLoading}
      />
    </Grid>
  )
}

jobPosting.acl = {
  subject: 'job_posting',
  action: 'read',
}
