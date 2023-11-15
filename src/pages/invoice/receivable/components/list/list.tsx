import { useRouter } from 'next/router'

// ** style components
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import {
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'

// ** types
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

// ** contexts
import { Dispatch, SetStateAction, useContext } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useGetStatusList } from '@src/queries/common.query'
import { UserRoleType } from '@src/context/types'

type Props = {
  page: number
  pageSize: number
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>

  list: {
    data: Array<InvoiceReceivableListType> | []
    totalCount: number
    count: number
  }
  isLoading: boolean
  role: UserRoleType

  setFilters: Dispatch<SetStateAction<InvoiceReceivableFilterType>>
  columns: GridColumns<InvoiceReceivableListType>
  type: 'list' | 'calendar'
}

export default function ReceivableList({
  page,
  pageSize,
  setPage,
  setPageSize,
  list,
  isLoading,
  role,

  setFilters,
  columns,
  type,
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
        sx={{
          overflowX: 'scroll',
          cursor: 'pointer',
          [`& .${gridClasses.row}.disabled`]: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }}
        columns={columns}
        rows={list.data}
        rowCount={list.totalCount ?? 0}
        loading={isLoading}
        onCellClick={params => {
          if (role.name === 'CLIENT' && params.row.invoiceStatus === 30500)
            return
          router.push(`/invoice/receivable/detail/${params.id}`)
        }}
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode='server'
        disableSelectionOnClick
        hideFooter={type === 'calendar'}
        onPageChange={(newPage: number) => {
          setFilters((prevState: InvoiceReceivableFilterType) => ({
            ...prevState,
            skip: newPage * pageSize!,
          }))
          setPage!(newPage)
        }}
        onPageSizeChange={(newPageSize: number) => {
          setFilters((prevState: InvoiceReceivableFilterType) => ({
            ...prevState,
            take: newPageSize,
          }))
          setPageSize!(newPageSize)
        }}
        getRowClassName={params =>
          role.name === 'CLIENT' && params.row.invoiceStatus === 30500
            ? 'disabled'
            : 'normal'
        }
        isRowSelectable={params =>
          role.name === 'CLIENT' && params.row.invoiceStatus !== 30500
        }
      />
    </Box>
  )
}
