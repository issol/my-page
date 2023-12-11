import {
  DataGrid,
  GridCallbackDetails,
  GridColumns,
  GridRowParams,
  GridSortModel,
  MuiEvent,
} from '@mui/x-data-grid'
import React, { Dispatch, useState } from 'react'

interface DefaultDataGridProps {
  data?: { data: Array<any>; totalCount: number; count: number }
  columns: GridColumns
  sortModel: GridSortModel
  setSortModel: Dispatch<GridSortModel>
  defaultPageSize: number
  setSkip: Dispatch<number>
  onRowClick?: (
    params: GridRowParams,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails,
  ) => void
}

const DefaultDataGrid = ({
  data,
  columns,
  defaultPageSize,
  sortModel,
  setSortModel,
  setSkip,
  onRowClick,
}: DefaultDataGridProps) => {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  return (
    <DataGrid
      autoHeight
      initialState={{
        sorting: { sortModel },
      }}
      page={page}
      onPageChange={newPage => {
        setPage(newPage)
        setSkip(newPage * defaultPageSize)
      }}
      pageSize={pageSize}
      onPageSizeChange={pageSize => setPageSize(pageSize)}
      paginationMode='server'
      rows={data?.data || []}
      columns={columns}
      rowCount={data?.totalCount || 0}
      onRowClick={onRowClick}
      rowsPerPageOptions={[]}
      sortModel={sortModel}
      onSortModelChange={newSortModel => setSortModel(newSortModel)}
    />
  )
}

export default DefaultDataGrid
