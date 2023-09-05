import { Box } from '@mui/material'
import JobFilters from './filters'
import JobList from './list'
import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import { FilterType } from '..'
import { useState } from 'react'
import { useGetProJobList } from '@src/queries/jobs/jobs.query'
import { useForm } from 'react-hook-form'

const defaultValues: FilterType = {
  jobDueDate: [],

  client: [],

  search: '',
}
export type JobListFilterType = {
  take?: number
  skip?: number
  search?: string
  ordering?: 'desc' | 'asc'
  sort?: 'corporationId'
  jobDueDateTo?: string
  jobDueDateFrom?: string
  requestedDateTo?: string
  requestedDateFrom?: string
  status?: number[]
  contactPerson?: string[]
  client?: string[]
}

const defaultFilters: JobListFilterType = {
  take: 10,
  skip: 0,
  search: '',

  client: [],
  jobDueDateFrom: '',
  jobDueDateTo: '',
}

const RequestedOngoingList = () => {
  const [filters, setFilters] = useState<JobListFilterType>(defaultFilters)

  const { data: jobList, isLoading } = useGetProJobList(filters)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])

  const { control, handleSubmit, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(defaultFilters)
  }

  const onSubmit = (data: FilterType) => {
    const {
      jobDueDate,

      client,

      search,
    } = data

    const filter: JobListFilterType = {
      client: client.map(value => value.label),

      jobDueDateFrom: jobDueDate[0]?.toISOString() ?? '',
      jobDueDateTo: jobDueDate[1]?.toISOString() ?? '',

      search: search,
      take: rowsPerPage,
      skip: rowsPerPage * page,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <JobFilters
        onSubmit={onSubmit}
        control={control}
        handleSubmit={handleSubmit}
        clientList={clientList}
        onReset={onClickResetButton}
      />
      <JobList
        type='requested'
        columns={getProJobColumns()}
        list={jobList?.data!}
        listCount={jobList?.totalCount!}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        isLoading={isLoading}
        setFilters={setFilters}
      />
    </Box>
  )
}

export default RequestedOngoingList
