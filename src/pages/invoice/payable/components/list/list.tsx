// ** style components
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridRowParams } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { invoicePayableStatusChip } from '@src/@core/components/chips/chips'

// ** types
import { InvoicePayableListType } from '@src/types/invoice/payable.type'

// ** helpers
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import {
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'

// ** contexts

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  InvoicePayableStatusType,
  InvoiceProStatusType,
} from '@src/types/invoice/common.type'
import { timezoneSelector } from '@src/states/permission'

type CellType = {
  row: InvoicePayableListType
}

type Props = {
  isAccountManager: boolean
  statusList: Array<{
    label: string
    value: number
  }>
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
  statusList,
  statuses,
  setStatuses,
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
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
      minWidth: 130,
      flex: 0.0807,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <>{row.corporationId}</>
      },
    },
    {
      field: 'Status',
      minWidth: 240,
      flex: 0.1491,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <>
            {/* {InvoicePayableChip(row.invoiceStatus as InvoicePayableStatusType)} */}
            {/* TODO: invoiceStatus 넘버로 오는지 확인 필요 */}
            {invoicePayableStatusChip(
              row.invoiceStatus as InvoiceProStatusType,
              statusList,
            )}
          </>
        )
      },
    },
    {
      field: 'Pro / Email',
      minWidth: 260,
      flex: 0.1615,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Pro / Email
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography fontWeight={600}>{row.pro?.name}</Typography>
            <Typography variant='body2'>{row.pro?.email}</Typography>
          </Box>
        )
      },
    },
    {
      field: 'invoicedAt',
      minWidth: 280,
      flex: 0.1739,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Invoice date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        if (auth.state === 'hasValue' && auth.getValue().user) {
          const date = convertTimeToTimezone(
            row.invoicedAt,
            auth.getValue().user?.timezone,
            timezone.getValue(),
          )
          return (
            <Tooltip title={date}>
              <Typography variant='body2'>{date}</Typography>
            </Tooltip>
          )
        }
      },
    },
    {
      field: 'payDueAt',
      minWidth: 280,
      flex: 0.1739,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment due
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.payDueAt,
          auth.getValue().user?.timezone,
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
      flex: 0.1739,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.paidAt,
          auth.getValue().user?.timezone,
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
      flex: 0.087,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Total price
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const price = `${formatCurrency(row.totalPrice, row.currency)}`
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
        initialState={{
          sorting: {
            sortModel: [{ field: 'corporationId', sort: 'desc' }],
          },
        }}
        autoHeight
        checkboxSelection={isAccountManager}
        isRowSelectable={(params: GridRowParams<InvoicePayableListType>) =>
          params.row.invoiceStatus !== 40300
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
        hideFooterSelectedRowCount
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        page={skip}
        pageSize={pageSize}
        paginationMode='server'
        onPageChange={setSkip}
        disableSelectionOnClick
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        onCellClick={(params, event) => {
          // 체크박스 클릭 시에는 행 클릭 이벤트 무시
          if (params.field === '__check__') {
            event.stopPropagation()
            return
          }
          // 그 외의 경우에는 정상적으로 행 클릭 처리
          router.push(`/invoice/payable/${params.id}`)
        }}
        sx={{
          overflowX: 'scroll',
          cursor: 'pointer',
        }}
      />
    </Box>
  )
}
