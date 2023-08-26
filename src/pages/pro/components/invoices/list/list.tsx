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
} from '@src/@core/components/chips/chips'

// ** types
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

// ** contexts
import { useContext } from 'react'
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'
import { ProInvoiceListType } from '@src/types/invoice/common.type'
import { useGetStatusList } from '@src/queries/common.query'

type CellType = {
  row: ProInvoiceListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<ProInvoiceListType> | []
    totalCount: number
  }
  isLoading: boolean
}

// TODO: totalPrice컬럼 완료하기
export default function ProInvoiceList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const router = useRouter()
  const { user } = useRecoilValue(authState)
  const { data: statusList } = useGetStatusList('InvoiceReceivable')
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

  const columns: GridColumns<ProInvoiceListType> = [
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
        const label = statusList?.find(i => i.value === row.status)?.label
        if (label) return <>{InvoiceReceivableChip(label, row.status)}</>
      },
    },

    {
      field: 'invoicedAt',
      minWidth: 280,
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
      minWidth: 280,
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
      minWidth: 280,
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
      minWidth: 140,
      disableColumnMenu: true,
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: CellType) => {
        // const price = `${getCurrencyMark(
        //   row.currency,
        // )} ${row.totalPrice.toLocaleString('ko-KR')}`

        return <Typography fontWeight={600}>보류</Typography>
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
        rowCount={list?.totalCount}
        loading={isLoading}
        onCellClick={params =>
          router.push(`/invoice/receivable/detail/${params.id}`)
        }
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
