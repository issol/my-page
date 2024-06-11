import { useRouter } from 'next/router'

// ** style components
import { Box } from '@mui/material'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'

// ** types
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'

// ** helpers

// ** contexts
import { Dispatch, SetStateAction } from 'react'

import { UserRoleType } from '@src/context/types'
import NoList from 'src/pages/[companyName]/components/no-list'

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

  setFilters: Dispatch<SetStateAction<InvoiceReceivableFilterType | null>>
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
          NoRowsOverlay: () => NoList('There are no invoices'),
          NoResultsOverlay: () => NoList('There are no invoices'),
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
          setFilters((prevState: InvoiceReceivableFilterType | null) => ({
            ...prevState!,
            skip: newPage * pageSize!,
          }))
          setPage!(newPage)
        }}
        onPageSizeChange={(newPageSize: number) => {
          setFilters((prevState: InvoiceReceivableFilterType | null) => ({
            ...prevState!,
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
