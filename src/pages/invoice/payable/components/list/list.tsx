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
import NoList from '@src/pages/components/no-list'

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
  type: 'list' | 'calendar'
  columns: GridColumns<InvoicePayableListType>
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
  type,
  columns,
}: Props) {
  const router = useRouter()

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
          params.row.invoiceStatus !== 40300
        }
        onSelectionModelChange={newSelectionModel => {
          if (!setStatuses) return
          setStatuses(newSelectionModel as number[])
        }}
        selectionModel={statuses}
        components={{
          NoRowsOverlay: () => NoList('There are no invoices'),
          NoResultsOverlay: () => NoList('There are no invoices'),
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
        hideFooter={type === 'calendar'}
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
