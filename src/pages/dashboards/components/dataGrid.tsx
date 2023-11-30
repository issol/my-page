import { Box } from '@mui/material'
import { DataGrid, GridRowsProp } from '@mui/x-data-grid'
import { RequestColumns } from '@src/shared/const/columns/dashboard'
import styled from '@emotion/styled'

interface DashboardDataGridProps {
  data: GridRowsProp
  page: number
  rowsPerPage: number
  totalCount: number
}

const DashboardDataGrid = ({
  data,
  page,
  rowsPerPage,
  totalCount,
}: DashboardDataGridProps) => {
  return (
    <Box sx={{ width: '100%', height: '260px' }}>
      <CustomDataGrid
        rows={data || []}
        columns={RequestColumns}
        headerHeight={0}
        components={{
          Header: () => null,
        }}
        page={0}
        pageSize={4}
        paginationMode='server'
        rowCount={totalCount}
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
