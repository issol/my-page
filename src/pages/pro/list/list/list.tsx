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
import { getProList } from '@src/apis/pro/pro-list.api'

type Props = {
  proListPage: number
  setProListPage: Dispatch<SetStateAction<number>>
  proListPageSize: number
  setProListPageSize: Dispatch<SetStateAction<number>>
  proList: ProListType[]
  proListCount: number
  filters: ProListFilterType
  setFilters: Dispatch<SetStateAction<ProListFilterType | null>>
  columns: GridColDef[]
  isLoading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  setRows: Dispatch<SetStateAction<ProListType[]>>
}

const ProList = ({
  proListPage,
  setProListPage,
  proListPageSize,
  setProListPageSize,
  proList,
  proListCount,
  filters,
  setFilters,
  columns,
  isLoading,
  setLoading,
  setRows,
}: Props) => {
  const apiRef = useGridApiRef()
  const router = useRouter()

  const handleOnRowsScrollEnd = useCallback<
    NonNullable<DataGridProProps['onRowsScrollEnd']>
  >(
    async params => {
      if (proListCount === proList.length) return

      if (proListCount >= params.visibleRowsCount) {
        setLoading(true)
        const rows = await getProList({
          ...filters,
          skip: params.visibleRowsCount >= 500 ? params.visibleRowsCount : 0,
          take: 500,
        })
        setLoading(false)
        setRows(prevRows => prevRows.concat(rows.data))
        setProListPage(
          params.visibleRowsCount >= 500 ? params.visibleRowsCount : 0,
        )
        setProListPageSize(500)
      }
    },
    [proList.length],
  )

  return (
    <Card sx={{ borderRadius: '0' }}>
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
          height: {
            lg: 'calc(97vh - 323px)', // 1075px 이상
            md: 'calc(97vh - 398px)', // 1075px 이하
            sm: 'calc(97vh - 398px)', // 1075px 이하
            xs: 'calc(97vh - 500px)', // 1075px 이하
          },
        }}
      >
        <DataGridPro
          rowHeight={40}
          apiRef={apiRef}
          slots={{
            noRowsOverlay: () => NoList('There are no Pros'),
            loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
          }}
          sx={{ overflowX: 'scroll' }}
          initialState={{
            pinnedColumns: { left: ['id', 'name'], right: ['actions'] },
          }}
          columns={columns}
          loading={isLoading}
          rows={proList ?? []}
          // autoHeight
          // disableSelectionOnClick
          // paginationMode='server'
          // pageSize={proListPageSize}
          // rowsPerPageOptions={[5, 10, 25, 50]}
          // page={proListPage}
          rowCount={proListCount}
          onRowsScrollEnd={handleOnRowsScrollEnd}
          scrollEndThreshold={200}
          hideFooter
          onCellClick={params => {
            router.push(`/pro/list/detail/${params.row.userId}`)
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
