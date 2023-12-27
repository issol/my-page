import { Box } from '@mui/material'
import {
  DataGrid,
  GridColumns,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid'
import { RequestColumns } from '@src/shared/const/columns/dashboard'
import styled from '@emotion/styled'
import { Suspense, useState } from 'react'
import { useDashboardRequest } from '@src/queries/dashboard/dashnaord-lpm'
import { useRouter } from 'next/router'
import { RequestType } from '@src/types/dashboard'
import NoList from '@src/pages/components/no-list'

interface DashboardDataGridProps {
  title: string
  path: string
  pageNumber: number
  movePage: (params: GridRowParams) => void
  sectionHeight?: number
  columns: GridColumns
}

const RequestDashboardDataGrid = ({
  title,
  path,
  pageNumber = 4,
  movePage,
  columns,
  sectionHeight = 260,
}: DashboardDataGridProps) => {
  const router = useRouter()
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(pageNumber)

  const { data, isLoading, isFetching } = useDashboardRequest(
    { skip, take: pageNumber, path },
    skip,
  )

  return (
    <Box
      sx={{
        width: '100%',
        height: `${sectionHeight}px`,
        padding: 0,
        margin: 0,
      }}
    >
      <Suspense fallback={<div>로딩 중</div>}>
        <CustomDataGrid
          getRowHeight={() => 54}
          rows={data?.data || []}
          columns={columns}
          headerHeight={0}
          components={{
            Header: () => null,
            NoRowsOverlay: () => NoList(`There is no ${title}`),
            NoResultsOverlay: () => NoList(`There is no ${title}`),
          }}
          page={page}
          onPageChange={newPage => {
            setPage(newPage)
            setSkip(val => newPage * pageNumber)
          }}
          onRowClick={params => movePage(params)}
          pageSize={pageSize}
          onPageSizeChange={pageSize => setPageSize(pageSize)}
          paginationMode='server'
          rowCount={data?.totalCount || 0}
          rowsPerPageOptions={[]}
          loading={isLoading || isFetching}
        />
      </Suspense>
    </Box>
  )
}

const CustomDataGrid = styled(DataGrid)(() => {
  return {
    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader': {
      display: 'none',
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: 'none !important',
    },
    '& .MuiDataGrid-virtualScrollerRenderZone': {
      width: 'max-content',
    },
    '& .MuiDataGrid-virtualScroller': {
      width: 'max-content',
    },
    '& .MuiDataGrid-cell--withRenderer': {
      padding: '0 20px 0 0  !important',
    },
    '& .desiredDueDate-status__cell': {
      minWidth: '52px !important',
    },

    '& .MuiDataGrid-row': {
      width: 'max-content !important',
      maxHeight: 'auto !important',
      minHeight: 'auto !important',
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

export default RequestDashboardDataGrid
