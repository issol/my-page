import { Box } from '@mui/material'
import { DataGrid, GridRowsProp } from '@mui/x-data-grid'
import { RequestColumns } from '@src/shared/const/columns/dashboard'
import styled from '@emotion/styled'
import { useState } from 'react'
import { useDashboardRequest } from '@src/queries/dashboard/dashnaord-lpm'

const DashboardDataGrid = () => {
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(4)

  const { data: RequestData } = useDashboardRequest({ skip, take: 4 }, skip)

  return (
    <Box sx={{ width: '100%', height: '260px' }}>
      <CustomDataGrid
        rows={RequestData.data || []}
        columns={RequestColumns}
        headerHeight={0}
        components={{
          Header: () => null,
        }}
        page={page}
        onPageChange={newPage => {
          setPage(newPage)
          setSkip(val => newPage * 4)
        }}
        pageSize={pageSize}
        onPageSizeChange={pageSize => setPageSize(pageSize)}
        paginationMode='server'
        rowCount={RequestData.totalCount}
        rowsPerPageOptions={[5]}
      />
    </Box>
  )
}

const CustomDataGrid = styled(DataGrid)(() => {
  return {
    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader': {
      display: 'none',
    },
    '& .MuiDataGrid-virtualScroller': {
      marginTop: '0 !important',
    },
    '& .MuiDataGrid-cell--withRenderer': {
      padding: '0 20px 0 0  !important',
    },
    '& .desiredDueDate-status__cell': {
      minWidth: '22px !important',
      flex: 1,
    },

    '& .MuiDataGrid-row': {
      paddingRight: '20px',
      cursor: 'pointer',
    },

    '& .MuiDataGrid-main': {
      '& .MuiDataGrid-cell': {
        borderBottom: 'none',
      },
    },
    '& .desiredDueDate-date__cell': {
      padding: '0 !important',
      maxWidth: '100% !important',
    },
  }
})

export default DashboardDataGrid
