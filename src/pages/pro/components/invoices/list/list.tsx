import { useRouter } from 'next/router'

// ** style components
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import {
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
  invoicePayableStatusChip,
} from '@src/@core/components/chips/chips'

// ** types
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'

// ** helpers
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import {
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'

// ** contexts
import { useContext } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { ProInvoiceListType } from '@src/types/invoice/common.type'
import { useGetStatusList } from '@src/queries/common.query'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'
import { timezoneSelector } from '@src/states/permission'

type CellType = {
  row: InvoicePayableListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<InvoicePayableListType> | []
    totalCount: number
  }
  isLoading: boolean
  statusList: Array<{
    label: string
    value: number
  }>
}

export default function ProInvoiceList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
  statusList,
}: Props) {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

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
        <Typography variant='subtitle1'>There are no invoices</Typography>
      </Box>
    )
  }

  const columns: GridColumns<InvoicePayableListType> = [
    {
      field: 'corporationId',
      minWidth: 130,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.corporationId}>
            <TableTitleTypography fontSize={14}>
              {row.corporationId}
            </TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Status',
      minWidth: 240,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return invoicePayableStatusChip(row.invoiceStatus, statusList!)
      },
    },

    {
      field: 'invoicedAt',
      minWidth: 280,
      disableColumnMenu: true,
      renderHeader: () => <Box>Invoice date</Box>,
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.invoicedAt,
          auth.getValue().user?.timezone.code,
          timezone.getValue(),
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'payDueAt',
      minWidth: 280,
      disableColumnMenu: true,
      renderHeader: () => <Box>Payment due</Box>,
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.payDueAt,
          row.payDueTimezone?.code,
          timezone.getValue(),
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'paidAt',
      minWidth: 280,
      disableColumnMenu: true,
      renderHeader: () => <Box>Payment date</Box>,
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.paidAt,
          row.paidDateTimezone?.code,
          timezone.getValue(),
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'totalPrice',
      minWidth: 140,
      disableColumnMenu: true,
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: CellType) => {
        return `${formatCurrency(row.totalPrice, row.currency)}`
      },
    },
  ]

  return (
    <Box
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          textTransform: 'none',
        },
      }}
    >
      <DataGrid
        autoHeight
        components={{
          NoRowsOverlay: () => NoList(),
          NoResultsOverlay: () => NoList(),
        }}
        sx={{ overflowX: 'scroll', cursor: 'pointer' }}
        columns={columns}
        rows={list?.data}
        rowCount={list?.totalCount ?? 0}
        loading={isLoading}
        onCellClick={params => router.push(`/invoice/payable/${params.id}`)}
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        page={skip}
        pageSize={pageSize}
        paginationMode='server'
        onPageChange={setSkip}
        disableSelectionOnClick
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Box>
  )
}
