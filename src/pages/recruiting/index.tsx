// ** react imports
import { useEffect, useState } from 'react'

// ** mui imports
import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'

// ** component imports
import RecruitingDashboard from './components/dashboard'
import Filters from './components/filter'
import RecruitingList from './components/list'

// ** values
import { ProRolePair } from 'src/shared/const/role/roles'
import { ProJobPair } from 'src/shared/const/job/jobs'

// ** fetch
import {
  useGetRecruitingCount,
  useGetRecruitingList,
} from 'src/queries/recruiting.query'

// ** types
import { RecruitingCountType } from 'src/apis/recruiting.api'
import { useQueryClient } from 'react-query'

export type FilterType = {
  client: string
  jobType: string
  role: string
  source: string
  target: string
  skip?: number
  take?: number
}

export const initialFilter: FilterType = {
  client: '',
  jobType: '',
  role: '',
  source: '',
  target: '',
  skip: 0,
  take: 10,
}
export default function Recruiting() {
  type FilterState = Array<{ value: string; label: string }>

  const queryClient = useQueryClient()
  const [jobTypeOption, setJobTypeOption] = useState<FilterState>([])
  const [roleOption, setRoleOption] = useState<FilterState>([])
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
  })

  const { data: list, isLoading } = useGetRecruitingList(activeFilter)
  const { data: counts } = useGetRecruitingCount()

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

    queryClient.invalidateQueries(['get-recruiting/list', activeFilter])
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    queryClient.invalidateQueries(['get-recruiting/list', activeFilter])
  }

  useEffect(() => {
    queryClient.invalidateQueries(['get-recruiting/list'])
  }, [])

  return (
    <Grid container spacing={6} className='match-height'>
      <PageHeader
        title={<Typography variant='h5'>Recruiting info</Typography>}
      />

      <RecruitingDashboard counts={counts as RecruitingCountType} />

      <Filters
        filter={filter}
        setFilter={setFilter}
        onReset={onReset}
        search={onSearch}
        jobTypeOption={jobTypeOption}
        roleOption={roleOption}
      />
      <RecruitingList
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

Recruiting.acl = {
  subject: 'recruiting',
  action: 'read',
}
