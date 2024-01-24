import { Box } from '@mui/material'
import {
  DataGrid,
  GridColumns,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid'
import { RequestColumns } from '@src/shared/const/columns/dashboard'
import { styled } from '@mui/system'
import React, { Suspense, useState } from 'react'
import { useDashboardRequest } from '@src/queries/dashnaord.query'
import { useRouter } from 'next/router'
import { RequestType } from '@src/types/dashboard'
import NoList from '@src/pages/components/no-list'
import DashboardForSuspense, {
  DashboardSuspenseProps,
} from '@src/views/dashboard/suspense'
import { Title } from '@src/views/dashboard/dashboardItem'

interface DashboardDataGridProps
  extends Omit<DashboardSuspenseProps, 'refreshDataQueryKey'> {
  overlayTitle: string
  path: string
  pageNumber: number
  movePage: (params: GridRowParams) => void
  sectionHeight?: number
  columns: GridColumns
}

const RequestDashboard = ({
  overlayTitle,
  path,
  pageNumber = 4,
  movePage,
  columns,
  sectionHeight = 260,
  sectionTitle,
  handleClick,
  setOpenInfoDialog,
}: DashboardDataGridProps) => {
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(pageNumber)

  const { data, isLoading, isFetching } = useDashboardRequest(
    { skip, take: pageNumber, path },
    skip,
  )

  return (
    <Box sx={{ width: '100%', marginTop: '20px' }}>
      <Box
        sx={{
          padding: sectionTitle === 'New requests' ? '0 20px 20px' : '0 20px',
        }}
      >
        <Title
          title={sectionTitle}
          openDialog={setOpenInfoDialog}
          handleClick={handleClick}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          height: `${sectionHeight}px`,
          padding: 0,
          margin: 0,
        }}
      >
        <CustomDataGrid
          getRowHeight={() => 54}
          rows={data?.data || []}
          columns={columns}
          headerHeight={0}
          components={{
            Header: () => null,
            NoRowsOverlay: () => NoList(`There is no ${overlayTitle}`),
            NoResultsOverlay: () => NoList(`There is no ${overlayTitle}`),
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
      </Box>
    </Box>
  )
}

const RequestDashboardDataGrid = (props: DashboardDataGridProps) => {
  return (
    <DashboardForSuspense {...props} refreshDataQueryKey='request'>
      <RequestDashboard {...props} />
    </DashboardForSuspense>
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
