import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material'
import { useGetProJobList } from '@src/queries/jobs/jobs.query'
import { JobListFilterType } from '../../requested-ongoing-list'
import { useState } from 'react'
import { FilterType } from '..'
import { Controller, useForm } from 'react-hook-form'
import {
  DataGrid,
  GridColumns,
  GridSelectionModel,
  gridClasses,
} from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import { useRouter } from 'next/router'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'
import useModal from '@src/hooks/useModal'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { CountryType } from '@src/types/sign/personalInfoTypes'

type Props = {
  onClose: any
  onClick: (data: {
    invoiceStatus: string
    description: string
    taxInfo: string
    taxRate: number
    currency: string
    totalPrice: number
    subtotal: number
    tax: number
    jobIds: number[]
    invoicedAt: string
    invoicedTimezone: CountryType
  }) => void
}

const defaultFilters: JobListFilterType = {
  take: 10,
  skip: 0,
  search: '',
  listType: 'completed-inactive',
  status: [601100],
}

const SelectJobModal = ({ onClose, onClick }: Props) => {
  const router = useRouter()
  const { openModal, closeModal } = useModal()
  const [filters, setFilters] = useState<JobListFilterType>(defaultFilters)

  const { data: jobList, isLoading } = useGetProJobList(filters)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const [selectedJobs, setSelectedJobs] = useState<Array<ProJobListType>>([])

  const { control, handleSubmit, reset } = useForm<FilterType>({
    defaultValues: { search: '' },
    mode: 'onSubmit',
  })

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    jobs: ProJobListType[],
  ) => {
    const selected: ProJobListType[] = selectionModel
      .map(id => jobs.find(job => job.id === id))
      .filter(job => job !== undefined) as ProJobListType[]
    console.log(selected)

    const firstCurrency = selected[0]?.currency
    const invalidSelections = selected.filter(
      job => job.currency !== firstCurrency,
    )

    if (invalidSelections.length > 0) {
      openModal({
        type: 'CurrencyCheckModal',
        children: (
          <AlertModal
            onClick={() => {
              const validSelections = selected.filter(
                job => job.currency === firstCurrency,
              )

              const validSelectionIds = validSelections.map(job => job.id)

              setSelectionModel(validSelectionIds)
              setSelectedJobs(validSelections)
              closeModal('CurrencyCheckModal')
            }}
            title="Please check the currency of the selected job. You can't choose different currencies in an invoice."
            vary='error'
            buttonText='Okay'
          />
        ),
      })
    } else {
      setSelectionModel(selectionModel)
      setSelectedJobs(selected)
    }
  }

  const onClickCreateInvoice = () => {
    console.log(selectedJobs)

    openModal({
      type: 'ClickCreateInvoiceModal',
      children: (
        <CustomModal
          onClose={() => closeModal('ClickCreateInvoiceModal')}
          title={
            <>
              Are you sure you want to create an
              <br />
              invoice with{' '}
              <Typography
                fontWeight={600}
                variant='body2'
                fontSize={16}
                component={'span'}
              >
                {selectedJobs.length}
              </Typography>{' '}
              selected job(s)?
            </>
          }
          vary='successful'
          rightButtonText='Create'
          onClick={() => {
            // onClick()
            closeModal('ClickCreateInvoiceModal')
          }}
        />
      ),
    })
  }

  const onSubmit = (data: FilterType) => {
    const { search } = data

    const filter: JobListFilterType = {
      search: search,
      take: rowsPerPage,
      skip: rowsPerPage * page,
      ordering: 'desc',
      sort: 'corporationId',
      listType: 'completed-inactive',
    }

    setFilters(filter)
  }

  const onClickResetButton = () => {
    reset({ search: '' })

    setFilters(defaultFilters)
  }

  function getTotalPrice(selectedJobs: ProJobListType[]) {
    let totalPrice = 0
    selectedJobs.forEach(job => {
      totalPrice += Number(job.totalPrice)
    })
    return totalPrice
  }

  const columns: GridColumns<ProJobListType> = [
    {
      flex: 0.2182,
      minWidth: 180,
      field: 'corporationId',
      headerName: 'No.',
      disableColumnMenu: true,
      // hideSortIcons: true,
      sortable: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <Typography variant='body1' fontWeight={400} fontSize={14}>
            {row.corporationId}
          </Typography>
        )
      },
    },

    {
      flex: 0.1818,
      minWidth: 150,
      field: 'serviceType',
      headerName: 'Job',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return <ServiceTypeChip label={row.serviceType} />
      },
    },
    {
      flex: 0.3273,
      minWidth: 270,
      field: 'name',
      headerName: 'Job name',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job name
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.name}
          </Typography>
        )
      },
    },
    {
      flex: 0.1939,
      minWidth: 160,
      field: 'totalPrice',
      headerName: 'Total price',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderCell: ({ row }: { row: ProJobListType }) => (
        <Typography fontWeight={600}>
          {getCurrencyMark(row.currency) ?? '$'}
          {Number(row.totalPrice).toLocaleString()}
        </Typography>
      ),
    },
  ]

  return (
    <Box
      sx={{
        maxWidth: '945px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',

        padding: '50px 60px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Typography variant='h5'>Select job</Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            marginTop: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <FormControl fullWidth>
            <Controller
              control={control}
              name='search'
              render={({ field: { onChange, value } }) => (
                <>
                  <InputLabel>Search jobs</InputLabel>
                  <OutlinedInput
                    label='Search jobs'
                    value={value}
                    onChange={onChange}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton edge='end'>
                          <Icon icon='mdi:magnify' />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </>
              )}
            />
          </FormControl>
          <Box display='flex' justifyContent='flex-end' gap='15px'>
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              type='button'
              onClick={onClickResetButton}
            >
              Reset
            </Button>
            <Button variant='contained' size='medium' type='submit'>
              Search
            </Button>
          </Box>
        </form>
        <Divider />

        <Card
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            autoHeight
            // getRowId={row => row?.orderId}
            components={{
              NoRowsOverlay: () => NoList('There are no jobs'),
              NoResultsOverlay: () => NoList('There are no jobs'),
            }}
            sx={{
              overflowX: 'scroll',
              cursor: 'pointer',

              // [`& .${gridClasses.row}.overdue`]: {
              //   // background: 'rgba(255, 77, 73, .1)',
              //   background: '#FFE1E0',
              // },
            }}
            columns={columns}
            rows={jobList?.data ?? []}
            rowCount={jobList?.totalCount ?? 0}
            loading={isLoading}
            // onCellClick={(params, event) => {
            //   event.stopPropagation()
            //   router.push(`/jobs/detail/${params.row.id}`)
            // }}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            page={page}
            pageSize={rowsPerPage}
            paginationMode='server'
            onPageChange={(newPage: number) => {
              setFilters!((prevState: JobListFilterType) => ({
                ...prevState,
                skip: newPage * rowsPerPage!,
              }))
              setPage!(newPage)
            }}
            onPageSizeChange={(newPageSize: number) => {
              setFilters!((prevState: JobListFilterType) => ({
                ...prevState,
                take: newPageSize,
              }))
              setRowsPerPage!(newPageSize)
            }}
            disableSelectionOnClick
            checkboxSelection
            selectionModel={selectionModel}
            onSelectionModelChange={(selectionModel: GridSelectionModel) =>
              handleSelectionModelChange(selectionModel, jobList?.data!)
            }
            hideFooterSelectedRowCount
            getRowId={row => row.id}
            // onRowSelectionModelChange={newRowSelectionModel => {
            //   setRowSelectionModel(newRowSelectionModel)
            // }}
            // rowSelectionModel={rowSelectionModel}
            // getRowClassName={params =>
            //   params.row.status === 'Job overdue' ? 'overdue' : 'normal'
            // }
          />
        </Card>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography variant='body1' fontWeight={600}>
              Selected job(s): {selectedJobs.length ?? 0}
            </Typography>
            <Typography variant='body1' fontWeight={600} color='#666CFF'>
              Subtotal: {getTotalPrice(selectedJobs)}
            </Typography>
          </Box>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            disabled={selectedJobs.length < 1}
            onClick={onClickCreateInvoice}
          >
            Create invoice
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SelectJobModal
