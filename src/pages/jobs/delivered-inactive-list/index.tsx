import { Box } from '@mui/material'
import { JobListFilterType } from '../requested-ongoing-list'
import { useState } from 'react'
import { useGetProJobList } from '@src/queries/jobs/jobs.query'
import { useForm } from 'react-hook-form'
import Filters from './filters'
import { useGetStatusList } from '@src/queries/common.query'

import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import JobList from '../requested-ongoing-list/list'
import useModal from '@src/hooks/useModal'
import SelectJobModal from './components/select-job-modal'

export type FilterType = {
  jobDueDate: Date[]
  requestedDate: Date[]
  status: Array<{ label: string; value: number }>

  client: Array<{ label: string; value: number }>
  contactPerson: Array<{ label: string; value: number }>

  search: string
}

const defaultValues: FilterType = {
  jobDueDate: [],
  requestedDate: [],
  status: [],
  contactPerson: [],

  client: [],

  search: '',
}

const defaultFilters: JobListFilterType = {
  take: 10,
  skip: 0,
  search: '',

  client: [],
  jobDueDateFrom: '',
  jobDueDateTo: '',
  requestedDateFrom: '',
  requestedDateTo: '',
  status: [],
  contactPerson: [],
}

const DeliveredInactiveList = () => {
  const { openModal, closeModal } = useModal()

  const [filters, setFilters] = useState<JobListFilterType>(defaultFilters)

  const { data: jobList, isLoading } = useGetProJobList(filters)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('Job')

  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])

  const [contactPersonList, setContactPersonList] = useState<
    { label: string; value: number }[]
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
      status,
      contactPerson,
      requestedDate,
      client,

      search,
    } = data

    const filter: JobListFilterType = {
      client: client.map(value => value.label),

      jobDueDateFrom: jobDueDate[0]?.toISOString() ?? '',
      jobDueDateTo: jobDueDate[1]?.toISOString() ?? '',

      requestedDateFrom: requestedDate[0]?.toISOString() ?? '',
      requestedDateTo: requestedDate[1]?.toISOString() ?? '',

      status: status.map(value => value.value),
      contactPerson: contactPerson.map(value => value.label),

      search: search,
      take: rowsPerPage,
      skip: rowsPerPage * page,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
  }

  const onClickCreateInvoice = () => {
    openModal({
      type: 'CreateInvoiceModal',
      children: (
        <SelectJobModal onClose={() => closeModal('CreateInvoiceModal')} />
      ),
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Filters
        clientList={clientList}
        contactPersonList={contactPersonList}
        handleSubmit={handleSubmit}
        control={control}
        onSubmit={onSubmit}
        onReset={onClickResetButton}
        statusList={statusList!}
      />
      <JobList
        type='delivered'
        columns={getProJobColumns()}
        list={jobList?.data!}
        listCount={jobList?.totalCount!}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        isLoading={isLoading}
        setFilters={setFilters}
        onClickCreateInvoice={onClickCreateInvoice}
      />
    </Box>
  )
}

export default DeliveredInactiveList
