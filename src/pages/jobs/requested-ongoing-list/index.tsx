import { Box } from '@mui/material'
import JobFilters from './filters'
import JobList from './list'
import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import { FilterType } from '..'
import { useEffect, useState } from 'react'
import {
  useGetProJobClientList,
  useGetProJobList,
} from '@src/queries/jobs/jobs.query'
import { useForm } from 'react-hook-form'
import { useGetStatusList } from '@src/queries/common.query'
import { statusType } from '@src/types/common/status.type'

const defaultValues: FilterType = {
  jobDueDate: [],

  client: null,

  search: '',
}
export type JobListFilterType = {
  take?: number
  skip?: number
  search?: string
  ordering?: 'desc' | 'asc'
  sort?: 'corporationId'
  dueDateTo?: string
  dueDateFrom?: string
  requestedDateTo?: string
  requestedDateFrom?: string
  status?: number[]
  contactPerson?: number | null
  client?: number | null
  listType?: 'requested-ongoing' | 'completed-inactive' | 'invoice'
}

export const ongoingDefaultFilters: JobListFilterType = {
  take: 10,
  skip: 0,
  search: '',

  client: null,
  dueDateFrom: '',
  dueDateTo: '',
  listType: 'requested-ongoing',
}

const RequestedOngoingList = () => {
  const [filters, setFilters] = useState<JobListFilterType>(
    ongoingDefaultFilters,
  )

  const { data: jobList, isLoading } = useGetProJobList(filters)
  const { data: clientList, isLoading: clientLoading } = useGetProJobClientList(
    {
      filterType: 'client',
    },
  )

  const { data: jobStatusList, isLoading: statusListLoading } =
    useGetStatusList('Job')
  const {
    data: assignmentJobStatusList,
    isLoading: assignmentStatusListLoading,
  } = useGetStatusList('JobAssignment')

  const [statusList, setStatusList] = useState<Array<statusType>>([])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { control, handleSubmit, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (
      jobStatusList &&
      assignmentJobStatusList &&
      !statusListLoading &&
      !assignmentStatusListLoading
    ) {
      setStatusList([...jobStatusList, ...assignmentJobStatusList])
    }
  }, [
    jobStatusList,
    statusListLoading,
    assignmentJobStatusList,
    assignmentStatusListLoading,
  ])

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(ongoingDefaultFilters)
  }

  const onSubmit = (data: FilterType) => {
    const {
      jobDueDate,

      client,

      search,
    } = data

    const filter: JobListFilterType = {
      client: client?.id,
      listType: 'requested-ongoing',

      dueDateFrom: jobDueDate[0]?.toISOString() ?? '',
      dueDateTo: jobDueDate[1]?.toISOString() ?? '',

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
        clientList={clientList!}
        clientListLoading={clientLoading}
        onReset={onClickResetButton}
      />
      <JobList
        type='requested'
        columns={getProJobColumns(statusList && statusList!)}
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
