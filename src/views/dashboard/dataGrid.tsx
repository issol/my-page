import { Box } from '@mui/material'
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid'
import { RequestColumns } from '@src/shared/const/columns/dashboard'
import styled from '@emotion/styled'
import { Suspense, useState } from 'react'
import { useDashboardRequest } from '@src/queries/dashboard/dashnaord-lpm'
import { useRouter } from 'next/router'
import { RequestType } from '@src/types/dashboard'

interface DashboardDataGridProps {
  type?: RequestType
  pageNumber: number
  movePage: (id: number) => void
  sectionHeight?: number
  columns: GridColumns
}

const DashboardDataGrid = ({
  type = 'new',
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
    { skip, take: pageNumber, type },
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
          rows={data?.data || []}
          columns={columns}
          headerHeight={0}
          components={{
            Header: () => null,
          }}
          page={page}
          onPageChange={newPage => {
            setPage(newPage)
            setSkip(val => newPage * 4)
          }}
          onRowClick={params =>
            router.push(`/quotes/lpm/requests/${params.id}/`)
          }
          pageSize={pageSize}
          onPageSizeChange={pageSize => setPageSize(pageSize)}
          paginationMode='server'
          rowCount={data?.totalCount || 0}
          rowsPerPageOptions={[5]}
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
      maxHeight: 'auto !important',
      minHeight: 'auto !important',
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
