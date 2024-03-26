import { Box } from '@mui/material'
import { JobListFilterType } from '../requested-ongoing-list'
import { useEffect, useState } from 'react'
import {
  useGetProJobClientList,
  useGetProJobList,
} from '@src/queries/jobs/jobs.query'
import { useForm } from 'react-hook-form'
import Filters from './filters'
import { useGetStatusList } from '@src/queries/common.query'
import { useMutation, useQueryClient } from 'react-query'
import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import JobList from '../requested-ongoing-list/list'
import useModal from '@src/hooks/useModal'
import SelectJobModal from './components/select-job-modal'
import { createInvoicePayable } from '@src/apis/invoice/payable.api'

import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { StatusItem } from '@src/types/common/status.type'

export type FilterType = {
  jobDueDate: Date[]
  requestedDate: Date[]
  status: Array<{ label: string; value: number }>

  client: { name: string; id: number } | null
  contactPerson: { name: string; id: number } | null

  search: string
}

const defaultValues: FilterType = {
  jobDueDate: [],
  requestedDate: [],
  status: [],
  contactPerson: null,

  client: null,

  search: '',
}

export const completedDefaultFilters: JobListFilterType = {
  take: 10,
  skip: 0,
  search: '',

  client: null,
  dueDateFrom: '',
  dueDateTo: '',
  requestedDateFrom: '',
  requestedDateTo: '',
  status: [],
  contactPerson: null,
  listType: 'completed-inactive',
}

const DeliveredInactiveList = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [filters, setFilters] = useState<JobListFilterType>(
    completedDefaultFilters,
  )

  const { data: jobList, isLoading } = useGetProJobList(filters)

  const { data: jobStatusList, isLoading: statusListLoading } =
    useGetStatusList('Job')
  const {
    data: assignmentJobStatusList,
    isLoading: assignmentStatusListLoading,
  } = useGetStatusList('JobAssignment')

  const [statusList, setStatusList] = useState<Array<StatusItem>>([])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: contactPersonList, isLoading: contactPersonListLoading } =
    useGetProJobClientList({
      filterType: 'contactPerson',
    })

  const { data: clientList, isLoading: clientListLoading } =
    useGetProJobClientList({
      filterType: 'client',
    })

  useEffect(() => {
    if (
      jobStatusList &&
      assignmentJobStatusList &&
      !statusListLoading &&
      !assignmentStatusListLoading
    ) {
      const customStatusList = [
        60600, 60700, 60800, 70200, 601000, 70400, 70500, 60900,
      ]
      const filteredJobStatusList = [
        ...jobStatusList.filter(value => {
          return value.value >= 60600 && value.value !== 601100
        }),
        ...assignmentJobStatusList.filter(value => {
          return [70200, 70400, 70500].includes(value.value)
        }),
      ].sort(
        (a, b) =>
          customStatusList.indexOf(a.value) - customStatusList.indexOf(b.value),
      )
      setStatusList([...filteredJobStatusList])
    }
  }, [
    jobStatusList,
    statusListLoading,
    assignmentJobStatusList,
    assignmentStatusListLoading,
  ])

  console.log("statusList", statusList)
  const createInvoiceMutation = useMutation(
    (params: {
      // invoiceStatus: string
      // description: string
      // taxInfo: string
      // taxRate: number
      currency: string
      // totalPrice: number
      subtotal: number
      // tax: number
      jobIds: number[]
      // invoicedAt: string
      // invoicedTimezone: CountryType
    }) => createInvoicePayable(params),
    {
      onSuccess: res => {
        closeModal('CreateInvoiceModal')
        router.push(`/invoice/pro/detail/${res?.id}`)
        toast.success('Success', {
          position: 'bottom-left',
        })
      },
      onError: (res: any) => {
        if (
          res.response?.data?.message ===
          `Pro's payment information is not saved`
        ) {
          openModal({
            type: 'ErrorModal',
            children: (
              <CustomModal
                title={
                  <>
                    Payment information is a prerequisite for invoice creation.
                    Please register your payment information first.
                  </>
                }
                onClose={() => closeModal('ErrorModal')}
                soloButton={true}
                rightButtonText='Go to payment info.'
                vary='error'
                onClick={() => {
                  closeModal('ErrorModal')
                  closeModal('CreateInvoiceModal')
                  router.push('/mypage/pro/')
                }}
              />
            ),
          })
        } else {
          toast.error('Something went wrong. Please try again.', {
            position: 'bottom-left',
          })
        }
      },
    },
  )

  const { control, handleSubmit, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(completedDefaultFilters)
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

    let statusResult = status.map(value => value.value)
    if (statusResult.some(item => item === 601000)) {
      statusResult.push(70400)
    }

    const filter: JobListFilterType = {
      client: client?.id,
      listType: 'completed-inactive',

      dueDateFrom: jobDueDate[0]?.toISOString() ?? '',
      dueDateTo: jobDueDate[1]?.toISOString() ?? '',

      requestedDateFrom: requestedDate[0]?.toISOString() ?? '',
      requestedDateTo: requestedDate[1]?.toISOString() ?? '',

      status: statusResult,
      contactPerson: contactPerson?.id,

      search: search,
      take: rowsPerPage,
      skip: rowsPerPage * page,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
  }

  const handleCreateInvoice = (data: {
    // invoiceStatus: string
    // description: string
    // taxInfo: string
    // taxRate: number
    currency: string
    // totalPrice: number
    subtotal: number
    // tax: number
    jobIds: number[]
    // invoicedAt: string
    // invoicedTimezone: CountryType
  }) => {
    createInvoiceMutation.mutate(data)
  }

  const onClickCreateInvoice = () => {
    openModal({
      type: 'CreateInvoiceModal',
      children: (
        <SelectJobModal
          onClose={() => closeModal('CreateInvoiceModal')}
          onClick={handleCreateInvoice}
        />
      ),
    })
  }

  useEffect(() => {
    queryClient.invalidateQueries(['proJobList', filters])
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {createInvoiceMutation.isLoading ? <OverlaySpinner /> : null}
      <Filters
        clientList={clientList!}
        contactPersonList={contactPersonList!}
        clientListLoading={clientListLoading}
        contactPersonListLoading={contactPersonListLoading}
        handleSubmit={handleSubmit}
        control={control}
        onSubmit={onSubmit}
        onReset={onClickResetButton}
        statusList={statusList!}
      />

      <JobList
        type='delivered'
        columns={getProJobColumns(statusList!)}
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
