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
import { AuthContext } from '@src/shared/auth/auth-provider'

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
  const { user } = useRecoilValue(authState)

  const queryClient = useQueryClient()

  const { data } = useGetPayableHistory(invoiceId, invoiceCorporationId)

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
        <Dialog open={true} onClose={() => closeModal('detail')} maxWidth='lg'>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={12} display='flex' alignItems='center' gap='4px'>
                <IconButton onClick={() => closeModal('detail')}>
                  <Icon icon='mdi:chevron-left' />
                </IconButton>
                <img
                  src={'/images/icons/invoice/coin.png'}
                  width={50}
                  height={50}
                  alt='invoice detail'
                />
                <Typography variant='h5'>{data?.corporationId}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ padding: '24px' }}>
                    <InvoiceDetailCard
                      isUpdatable={false}
                      data={{
                        ...data,
                        invoicedAtTimezone: data.invoicedTimezone,
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
                    invoicedAtTimezone: data.invoicedTimezone,
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
                <Button
                  variant='contained'
                  disabled={!isUpdatable}
                  onClick={restoreVersion}
                >
                  Restore this version
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      ),
    })
  }

  const columns: GridColumns<PayableHistoryType> = [
    {
      field: 'version',
      flex: 0.05,
      minWidth: 120,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Typography>Version</Typography>,
      renderCell: ({ row }: CellType) => {
        return <Box>Ver.{row.version}</Box>
      },
    },
    {
      flex: 0.05,
      minWidth: 214,
      field: 'account',
      headerName: 'Account',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Account</Box>,
      renderCell: ({ row }: CellType) => <Typography>{row.account}</Typography>,
    },
    {
      flex: 0.1,
      minWidth: 260,
      field: 'date',
      headerName: 'Date & Time',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography>
            {FullDateTimezoneHelper(row?.invoicedAt, user?.timezone?.code!)}
          </Typography>
        )
      },
    },
  ]

  function NoList() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>There is no version history</Typography>
      </Box>
    )
  }
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
          NoRowsOverlay: () => NoList(),
          NoResultsOverlay: () => NoList(),
        }}
        sx={{ overflowX: 'scroll', cursor: 'pointer' }}
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
