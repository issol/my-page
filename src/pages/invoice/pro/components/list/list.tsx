import { Box } from '@mui/material'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'

import NoList from '@src/pages/components/no-list'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'
import { InvoiceProListType } from '@src/types/invoice/pro.type'

import { useRouter } from 'next/router'

type Props = {
  page: number
  pageSize: number
  setPage: (num: number) => void
  setPageSize: (num: number) => void
  isLoading: boolean
  columns: GridColumns<InvoicePayableListType>
  list: {
    data: Array<InvoicePayableListType> | []
    totalCount: number
    count: number
  }
  type: 'list' | 'calendar'
}

const List = ({
  page,
  pageSize,
  setPage,
  setPageSize,
  isLoading,
  columns,
  list,
  type,
}: Props) => {
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
        onCellClick={params => router.push(`/invoice/pro/detail/${params.id}`)}
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode='server'
        disableSelectionOnClick
        hideFooter={type === 'calendar'}
        onPageChange={(newPage: number) => {
          setPage(newPage)
        }}
        onPageSizeChange={(newPageSize: number) => {
          setPageSize(newPageSize)
        }}
        getRowClassName={params =>
          params.row.invoiceStatus === 'Under revision' ? 'disabled' : 'normal'
        }
        isRowSelectable={params =>
          params.row.invoiceStatus !== 'Under revision'
        }
      />
    </Box>
  )
}

export default List
