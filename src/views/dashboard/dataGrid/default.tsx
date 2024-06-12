import {
  DataGrid,
  GridCallbackDetails,
  GridColumns,
  GridRowParams,
  GridSortModel,
  MuiEvent,
} from '@mui/x-data-grid'
import React, { Dispatch, useState } from 'react'
import NoList from 'src/pages/[companyName]/components/no-list'
import { styled } from '@mui/system'

interface DefaultDataGridProps<T extends { id: number; orderId?: number }> {
  overlayTitle: string
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

const DefaultDataGrid = <T extends { id: number; orderId?: number }>({
  overlayTitle,
  data,
  columns,
  defaultPageSize,
  sortModel,
  setSortModel,
  setSkip,
  onRowClick,
}: DefaultDataGridProps<T>) => {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  return (
    <CustomDataGrid
      sortingOrder={['desc', 'asc']}
      initialState={{
        sorting: { sortModel },
      }}
      page={page}
      onPageChange={newPage => {
        setPage(newPage)
        setSkip(newPage * defaultPageSize)
      }}
      sortingMode='server'
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
      components={{
        NoRowsOverlay: () => NoList(`${overlayTitle}`),
        NoResultsOverlay: () => NoList(`${overlayTitle}`),
      }}
    />
  )
}

const CustomDataGrid = styled(DataGrid)(() => {
  return {
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
    },
  }
})

export default DefaultDataGrid
