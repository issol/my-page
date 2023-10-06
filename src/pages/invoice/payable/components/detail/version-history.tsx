// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

// ** context
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

// ** apis
import { useGetPayableHistory } from '@src/queries/invoice/payable.query'
import { restoreInvoicePayable } from '@src/apis/invoice/payable.api'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'

// ** types
import { PayableHistoryType } from '@src/types/invoice/payable.type'

// ** components
import InvoiceDetailCard from './invoice-detail-card'
import InvoiceAmount from './invoice-amount'
import InvoiceJobList from './job-list'
import { toast } from 'react-hot-toast'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import NoList from '@src/pages/components/no-list'

type Props = {
  invoiceId: number
  invoiceCorporationId: string
  isUpdatable: boolean
}

type CellType = {
  row: PayableHistoryType
}

export default function PayableHistory({
  invoiceId,
  invoiceCorporationId,
  isUpdatable,
}: Props) {
  const auth = useRecoilValueLoadable(authState)

  const queryClient = useQueryClient()

  const { data } = useGetPayableHistory(invoiceId, invoiceCorporationId)

  console.log(data)

  const { openModal, closeModal } = useModal()

  const [pageSize, setPageSize] = useState(5)

  const restore = useMutation(() => restoreInvoicePayable(Number(invoiceId)), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
      queryClient.invalidateQueries({ queryKey: 'invoice/payable/history' })
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  function restoreVersion() {
    closeModal('detail')
    openModal({
      type: 'restore',
      children: (
        <CustomModal
          vary='error'
          title='Are you sure you want to restore this version?'
          rightButtonText='Restore'
          onClose={() => closeModal('restore')}
          onClick={() => {
            restore.mutate()
            closeModal('restore')
          }}
        />
      ),
    })
  }

  function onRowClick(data: PayableHistoryType) {
    const jobList = data.jobs
    openModal({
      type: 'detail',
      children: (
        <Box
          sx={{
            maxWidth: '1266Px',
            width: '100%',
            background: '#ffffff',
            boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
            borderRadius: '10px',
          }}
        >
          <Box sx={{ padding: '50px 60px' }}>
            <Grid container spacing={6}>
              <Grid item xs={12} display='flex' alignItems='center' gap='4px'>
                <img
                  src={'/images/icons/invoice/coin.png'}
                  width={50}
                  height={50}
                  alt='invoice detail'
                />
                <Typography variant='h5'>
                  [Ver. {data.version}] {data?.corporationId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ padding: '24px' }}>
                    <InvoiceDetailCard
                      isUpdatable={false}
                      data={{
                        ...data,
                        invoicedAtTimezone: data.invoicedAtTimezone,
                      }}
                      editInfo={false}
                      setEditInfo={() => {
                        return null
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <InvoiceAmount
                  data={{
                    ...data,
                    invoicedAtTimezone: data.invoicedAtTimezone,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title={
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Typography variant='h6'>
                          Jobs ({jobList?.totalCount ?? 0})
                        </Typography>
                      </Box>
                    }
                  />
                  <InvoiceJobList
                    data={jobList}
                    currency={data?.currency}
                    isUpdatable={false}
                    selectedJobs={[]}
                    setSelectedJobs={() => []}
                    onRowClick={() => {
                      return null
                    }}
                  />
                </Card>
              </Grid>
              <Grid
                item
                xs={12}
                display='flex'
                justifyContent='center'
                gap='12px'
              >
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => closeModal('detail')}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ),
    })
  }

  const columns: GridColumns<PayableHistoryType> = [
    {
      field: 'version',
      flex: 0.336,
      minWidth: 420,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontSize={14} fontWeight={500}>
          Version
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body1'>Ver.{row.version}</Typography>
      },
    },
    {
      flex: 0.336,
      minWidth: 420,
      field: 'account',
      headerName: 'Account',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontSize={14} fontWeight={500}>
          Account
        </Typography>
      ),
      renderCell: ({ row }: CellType) => (
        <Typography variant='body1'>
          {row.account === '' ? '-' : row.account}
        </Typography>
      ),
    },
    {
      flex: 0.328,
      minWidth: 410,
      field: 'date',
      headerName: 'Date & Time',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontSize={14} fontWeight={500}>
          Date & Time
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        if (auth.state === 'hasValue' && auth.getValue().user)
          return (
            <Typography variant='body1'>
              {FullDateTimezoneHelper(
                row?.invoicedAt,
                auth.getValue().user?.timezone?.code!,
              )}
            </Typography>
          )
      },
    },
  ]

  return (
    <>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Version history ({data?.length ?? 0})
            </Typography>{' '}
          </Box>
        }
      />
      <DataGrid
        autoHeight
        components={{
          NoRowsOverlay: () => NoList('There is no version history'),
          NoResultsOverlay: () => NoList('There is no version history'),
        }}
        sx={{
          overflowX: 'scroll',
          '.MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        hideFooterSelectedRowCount
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[5, 15, 30]}
        rowCount={data?.length}
        rows={data || []}
        onRowClick={row => onRowClick(row.row)}
      />
    </>
  )
}
