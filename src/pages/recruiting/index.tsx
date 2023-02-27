// ** react imports
import { useEffect, useState } from 'react'

// ** mui imports
import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'

// ** component imports
import RecruitingDashboard from './components/dashboard'
import Filters from './components/filter'

// ** third parties
import isEqual from 'lodash/isEqual'

// ** values
import {
  JobList,
  ProJobPair,
  ProRolePair,
  RoleList,
} from 'src/shared/const/common'

export type FilterType = {
  client: string
  jobType: string
  role: string
  source: string
  target: string
  skip: number
  pageSize: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'pageSize'>

export const initialFilter: FilterOmitType = {
  client: '',
  jobType: '',
  role: '',
  source: '',
  target: '',
}
export default function Recruiting() {
  type FilterState = Array<{ value: string; label: string }>
  const [filter, setFilter] = useState<FilterOmitType>({ ...initialFilter })
  const [jobTypeOption, setJobTypeOption] = useState<FilterState>([])
  const [roleOption, setRoleOption] = useState<FilterState>([])
  const [skip, setSkip] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)

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
    // setJobTypeOption(newFilter)
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
      // refetch()
    }
  }, [filter])

  return (
    <Grid container spacing={6} className='match-height'>
      <PageHeader
        title={<Typography variant='h5'>Recruiting info</Typography>}
      />
      {/* TODO : data받아서 전달하기 */}
      <RecruitingDashboard />

      <Filters
        filter={filter}
        setFilter={setFilter}
        onReset={onReset}
        search={() => setSearch(true)}
        jobTypeOption={jobTypeOption}
        roleOption={roleOption}
      />
    </Grid>
  )
}

Recruiting.acl = {
  subject: 'recruiting',
  action: 'read',
}
