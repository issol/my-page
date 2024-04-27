import { Card, Grid, LinearProgress, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

import { ProListFilterType, ProListType } from '@src/types/pro/list'
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid-pro'
import { NoList } from '@src/pages/components/no-list'
import { useRouter } from 'next/router'

type Props = {
  proListPage: number
  setProListPage: Dispatch<SetStateAction<number>>
  proListPageSize: number
  setProListPageSize: Dispatch<SetStateAction<number>>
  proList: ProListType[]
  proListCount: number
  setFilters: Dispatch<SetStateAction<ProListFilterType | null>>
  columns: GridColDef[]
  isLoading: boolean
}

const ProList = ({
  proListPage,
  setProListPage,
  proListPageSize,
  setProListPageSize,
  proList,
  proListCount,
  setFilters,
  columns,
  isLoading,
}: Props) => {
  const apiRef = useGridApiRef()
  const router = useRouter()

  const handleOnRowsScrollEnd = useCallback<
    NonNullable<DataGridProProps['onRowsScrollEnd']>
  >(async params => {
    setFilters(prev => ({ ...prev, skip: params.visibleRowsCount, take: 500 }))
  }, [])

  return (
    <Card sx={{ borderRadius: '0 0 16px 16px', }}>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
          '& .MuiDataGrid-cell': {
            padding: '0 20px !important',
            justifyContent: 'center',
            alignContent: 'center',
          },
          height: 'calc(97vh - 420px)',
        }}
      >
        <DataGridPro
          rowHeight={40}
          apiRef={apiRef}
          sx={{
            cursor: 'pointer',
            '& .MuiDataGrid-columnHeaders': {
              borderTop: '1px solid #4C4E6412', // 회색 상단 보더 설정
            },
            '& .MuiDataGrid-cell--pinnedLeft.highlight-cell': {
              backgroundColor: '#FFF2F2',
            },
            '& .MuiDataGrid-cell--pinnedLeft': {
              backgroundColor: '#FFF',
            },
            '& .MuiDataGrid-filler--pinnedLeft': {
              backgroundColor: '#FFF',
            },
            borderRadius: 'none',
          }}
          slots={{
            noRowsOverlay: () => NoList('There are no Pros'),
            loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
          }}
          // sx={{ overflowX: 'scroll' }}
          initialState={{
            pinnedColumns: { left: ['id', 'name'], right: ['actions'] },
          }}
          columns={columns}
          loading={isLoading}
          rows={proList ?? []}
          // autoHeight
          // disableSelectionOnClick
          paginationMode='server'
          // pageSize={proListPageSize}
          // rowsPerPageOptions={[5, 10, 25, 50]}
          // page={proListPage}
          rowCount={proListCount}
          onRowsScrollEnd={handleOnRowsScrollEnd}
          scrollEndThreshold={200}
          hideFooter
          onCellClick={params => {
            if (params.field !== 'resume') router.push(`/pro/list/detail/${params.row.userId}`)
          }}
          // onPageChange={(newPage: number) => {
          //   setFilters((prevState: ProListFilterType) => ({
          //     ...prevState,
          //     skip: newPage * proListPageSize,
          //   }))
          //   setProListPage(newPage)
          // }}
          // onPageSizeChange={(newPageSize: number) => {
          //   setFilters((prevState: ProListFilterType) => ({
          //     ...prevState,
          //     take: newPageSize,
          //   }))
          //   setProListPageSize(newPageSize)
          // }}
        />
      </Box>
    </Card>
  )
}
export default ProList
