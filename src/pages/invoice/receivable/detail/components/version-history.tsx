import { Box, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { InvoiceVersionHistoryType } from '@src/types/invoice/receivable.type'

import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: Array<InvoiceVersionHistoryType>
  listCount: number
  columns: GridColumns<InvoiceVersionHistoryType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  onClickRow: (history: InvoiceVersionHistoryType) => void
}

const InvoiceVersionHistory = ({
  list,
  listCount,
  columns,
  pageSize,
  setPageSize,
  page,
  setPage,
  onClickRow,
}: Props) => {
  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Version history ({listCount ?? 0})
            </Typography>
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          autoHeight
          // components={{
          //   NoRowsOverlay: () => NoList(),
          //   NoResultsOverlay: () => NoList(),
          // }}
          sx={{ overflowX: 'scroll', cursor: 'pointer' }}
          columns={columns}
          rows={list ?? []}
          // rowCount={listCount ?? 0}
          // loading={isLoading}
          onCellClick={params => {
            onClickRow(params.row)
          }}
          rowsPerPageOptions={[5, 15, 30]}
          // pagination
          // page={page}
          // pageSize={pageSize}
          // paginationMode='server'
          // onPageChange={(newPage: number) => {
          //   // setFilters!((prevState: OrderListFilterType) => ({
          //   //   ...prevState,
          //   //   skip: newPage * rowsPerPage!,
          //   // }))
          //   setPage(newPage)
          // }}
          // onPageSizeChange={(newPageSize: number) => {
          //   // setFilters!((prevState: OrderListFilterType) => ({
          //   //   ...prevState,
          //   //   take: newPageSize,
          //   // }))
          //   setPageSize(newPageSize)
          // }}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default InvoiceVersionHistory
