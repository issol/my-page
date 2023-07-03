import { Icon } from '@iconify/react'
import {
  Box,
  CardHeader,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { AuthContext } from '@src/context/AuthContext'
import useModal from '@src/hooks/useModal'
import { useGetPayableHistory } from '@src/queries/invoice/payable.query'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { PayableHistoryType } from '@src/types/invoice/payable.type'
import { useContext, useState } from 'react'

type Props = {
  invoiceId: number
  invoiceCorporationId: string
}

type CellType = {
  row: PayableHistoryType
}

export default function PayableHistory({
  invoiceId,
  invoiceCorporationId,
}: Props) {
  const { data } = useGetPayableHistory(invoiceId, invoiceCorporationId)
  console.log('history', data)
  const { openModal, closeModal } = useModal()
  const { user } = useContext(AuthContext)
  const [pageSize, setPageSize] = useState(5)

  function onRowClick(data: any) {
    console.log('data', data)
    openModal({
      type: 'detail',
      children: (
        <Dialog open={true} onClose={() => closeModal('detail')} maxWidth='lg'>
          <DialogContent>
            <Box display='flex' alignItems='center' gap='4px'>
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
            </Box>
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
