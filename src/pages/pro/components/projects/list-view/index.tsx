import { useState } from 'react'
import { Grid } from '@mui/material'

export type FilterType = {
  status?: Array<string>
  clients?: Array<string>
  source?: Array<string>
  target?: Array<string>
  jobType?: Array<string>
  role?: Array<string>
  experience?: Array<string>
  skip?: number
  take?: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'take'>

export const initialFilter: FilterOmitType = {
  status: [],
  clients: [],
  source: [],
  target: [],
  jobType: [],
  role: [],
  experience: [],
}

export function ProjectListView() {
  type FilterState = Array<{ value: string; label: string }>
  const [filter, setFilter] = useState<FilterOmitType>({ ...initialFilter })
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)
  return (
    <Grid container spacing={6} className='match-height'>
      {/* <Filters
      filter={filter}
      setFilter={setFilter}
      jobTypeOption={jobTypeOption}
      onReset={onReset}
      roleOption={roleOption}
      search={() => setSearch(true)}
    /> */}
    </Grid>
  )
}
