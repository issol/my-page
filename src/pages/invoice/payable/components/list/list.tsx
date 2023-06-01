import { useRouter } from 'next/router'
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridRowParams } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'
import { InvoicePayableChip } from '@src/@core/components/chips/chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { useContext } from 'react'
import { AuthContext } from '@src/context/AuthContext'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'
type CellType = {
  row: InvoicePayableListType
}

type Props = {
  isAccountManager: boolean
  statuses?: number[]
  setStatuses?: (n: number[]) => void
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<InvoicePayableListType> | []
    totalCount: number
  }
  isLoading: boolean
}

export default function PayableList({
  isAccountManager,
  statuses,
  setStatuses,
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const router = useRouter()
  const { user } = useContext(AuthContext)

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

      minWidth: 182,
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
      minWidth: 182,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return <>{InvoicePayableChip(row.invoiceStatus)}</>
      },
    },
    {
      field: 'Pro / Email',
      minWidth: 182,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography fontWeight={600}>{row.pro.name}</Typography>
            <Typography variant='body2'>{row.pro.email}</Typography>
          </Box>
        )
      },
    },
    {
      field: 'Invoice date',
      minWidth: 182,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(row.invoicedAt, user?.timezone.code)
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Payment due',
      minWidth: 182,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(
          row.payDueAt,
          row.payDueTimezone?.code,
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Payment date',
      minWidth: 182,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(
          row.paidAt,
          row.paidDateTimezone?.code,
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Total price',
      minWidth: 182,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        const price = `${getCurrencyMark(
          row.currency,
        )} ${row.totalPrice.toLocaleString('ko-KR')}`
        return (
          <Tooltip title={price}>
            <Typography fontWeight={600}>{price}</Typography>
          </Tooltip>
        )
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
        checkboxSelection={isAccountManager}
        isRowSelectable={(params: GridRowParams<InvoicePayableListType>) =>
          params.row.invoiceStatus !== 'Paid'
        }
        onSelectionModelChange={newSelectionModel => {
          if (!setStatuses) return
          setStatuses(newSelectionModel as number[])
        }}
        selectionModel={statuses}
        components={{
          NoRowsOverlay: () => NoList(),
          NoResultsOverlay: () => NoList(),
        }}
        sx={{ overflowX: 'scroll', cursor: 'pointer' }}
        columns={columns}
        rows={list.data}
        rowCount={list.totalCount}
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
