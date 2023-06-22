import { useRouter } from 'next/router'

// ** style components
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridRowParams } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { InvoicePayableChip } from '@src/@core/components/chips/chips'

// ** types
import { InvoicePayableListType } from '@src/types/invoice/payable.type'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

// ** contexts
import { useContext } from 'react'
import { AuthContext } from '@src/context/AuthContext'
import Link from 'next/link'

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
            <Link href={`/invoice/payable/${row.id}`}>
              <TableTitleTypography fontSize={14}>
                {row.corporationId}
              </TableTitleTypography>
            </Link>
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
      field: 'invoicedAt',
      minWidth: 182,
      disableColumnMenu: true,
      renderHeader: () => <Box>Invoice date</Box>,
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
      field: 'payDueAt',
      minWidth: 182,
      disableColumnMenu: true,
      renderHeader: () => <Box>Payment due</Box>,
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
      field: 'paidAt',
      minWidth: 182,
      disableColumnMenu: true,
      renderHeader: () => <Box>Payment date</Box>,
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
      field: 'totalPrice',
      minWidth: 182,
      disableColumnMenu: true,
      renderHeader: () => <Box>Total price</Box>,
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
  console.log('daaa', list.data)
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
        columns={columns}
        rows={list.data}
        rowCount={list.totalCount}
        loading={isLoading}
        // onCellClick={params => router.push(`/invoice/payable/${params.id}`)}
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
