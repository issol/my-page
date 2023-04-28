import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  ProjectTeamType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: Array<VersionHistoryType>
  listCount: number
  columns: GridColumns<VersionHistoryType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  onClickRow: (history: VersionHistoryType) => void
}

const VersionHistory = ({
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
          rowCount={listCount ?? 0}
          // loading={isLoading}
          onCellClick={params => {
            onClickRow(params.row)
          }}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode='server'
          onPageChange={(newPage: number) => {
            // setFilters!((prevState: OrderListFilterType) => ({
            //   ...prevState,
            //   skip: newPage * rowsPerPage!,
            // }))
            setPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            // setFilters!((prevState: OrderListFilterType) => ({
            //   ...prevState,
            //   take: newPageSize,
            // }))
            setPageSize(newPageSize)
          }}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default VersionHistory
