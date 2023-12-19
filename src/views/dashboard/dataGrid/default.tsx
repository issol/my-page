import {
  DataGrid,
  GridCallbackDetails,
  GridColumns,
  GridRowParams,
  GridSortModel,
  MuiEvent,
} from '@mui/x-data-grid'
import React, { Dispatch, useState } from 'react'
import NoList from '@src/pages/components/no-list'
import styled from '@emotion/styled'

interface DefaultDataGridProps {
  title: string
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
  title,
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
    <CustomDataGrid
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
      components={{
        NoRowsOverlay: () => NoList(`There is no ${title}`),
        NoResultsOverlay: () => NoList(`There is no ${title}`),
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
