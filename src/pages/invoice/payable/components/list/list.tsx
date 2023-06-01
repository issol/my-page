import { useRouter } from 'next/router'
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridRowParams } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'
import { InvoicePayableChip } from '@src/@core/components/chips/chips'

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
        return (
          <Box>
            <Typography fontWeight={600}>{row.pro.name}</Typography>
            <Typography variant='body2'>{row.pro.email}</Typography>
          </Box>
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
