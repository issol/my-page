import { Card, Grid, Typography, LinearProgress } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import { Dispatch, SetStateAction, useCallback } from 'react'

import {
  OnboardingFilterType,
  OnboardingListType,
} from '@src/types/onboarding/list'
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid-pro'
import NoList from '@src/pages/components/no-list'
import { useRouter } from 'next/router'
import { getOnboardingProList } from '@src/apis/onboarding.api'

type Props = {
  onboardingListPage: number
  setOnboardingListPage: Dispatch<SetStateAction<number>>
  onboardingListPageSize: number
  setOnboardingListPageSize: Dispatch<SetStateAction<number>>
  onboardingProList: OnboardingListType[]
  onboardingProListCount: number
  filters: OnboardingFilterType
  setFilters: Dispatch<SetStateAction<OnboardingFilterType | null>>
  columns: GridColDef[]
  isLoading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  handleRowClick: (id: number) => void
  setRows: Dispatch<SetStateAction<OnboardingListType[]>>
}

export default function OnboardingList({
  onboardingListPage,
  setOnboardingListPage,
  onboardingListPageSize,
  setOnboardingListPageSize,
  onboardingProList,
  onboardingProListCount,
  setFilters,
  filters,
  columns,
  isLoading,
  handleRowClick,
  setRows,
  setLoading,
}: Props) {
  const apiRef = useGridApiRef()
  const router = useRouter()

  const handleOnRowsScrollEnd = useCallback<
    NonNullable<DataGridProProps['onRowsScrollEnd']>
  >(
    async params => {
      if (onboardingProListCount === onboardingProList.length) return
      if (onboardingProListCount >= params.visibleRowsCount) {
        setLoading(true)
      }

      const rows = await getOnboardingProList({
        ...filters,
        skip: params.visibleRowsCount >= 500 ? params.visibleRowsCount : 0,
        take: 500,
      })

      setLoading(false)
      setRows(prevRows => prevRows.concat(rows.data))
      setOnboardingListPage(
        params.visibleRowsCount >= 500 ? params.visibleRowsCount : 0,
      )
      setOnboardingListPageSize(500)
    },
    [onboardingProList.length],
  )

  return (
    <Card
      sx={{
        borderRadius: '0 0 16px 16px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: {
            lg: 'calc(97vh - 323px)', // 1075px 이상
            md: 'calc(97vh - 398px)', // 1075px 이하
            sm: 'calc(97vh - 398px)', // 1075px 이하
            xs: 'calc(97vh - 500px)', // 1075px 이하
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
          '& .MuiDataGrid-cell': {
            padding: '0 20px !important',
            justifyContent: 'center',
            alignContent: 'center',
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
          rows={onboardingProList ?? []}
          paginationMode='server'
          rowCount={onboardingProListCount}
          onRowsScrollEnd={handleOnRowsScrollEnd}
          scrollEndThreshold={200}
          hideFooter
          onCellClick={params => {
            if (params.field !== 'resume') handleRowClick(params.row.userId)
          }}
        />
        {/* <DataGrid
          sx={{
            cursor: 'pointer',
            '& .MuiDataGrid-columnHeaders': {
              borderTop: '1px solid #4C4E6412', // 회색 상단 보더 설정
            },
          }}
          components={{
            NoRowsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>There are no Pros</Typography>
                </Box>
              )
            },
            NoResultsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>There are no Pros</Typography>
                </Box>
              )
            },
            '& .MuiDataGrid-cell': {
              padding: '0 20px !important',
              justifyContent: 'center',
              alignContent: 'center',
            },
          }}
          onCellClick={params => {
            if (params.field !== 'resume') handleRowClick(params.row.userId)
          }}
          columns={columns}
          rowHeight={40}
          loading={isLoading}
          rows={onboardingProList ?? []}
          disableSelectionOnClick
          paginationMode='server'
          pageSize={onboardingListPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={onboardingListPage}
          rowCount={onboardingProListCount}
          onPageChange={(newPage: number) => {
            setFilters((prevState: OnboardingFilterType | null) => ({
              ...prevState!,
              skip: newPage * onboardingListPageSize,
            }))
            setOnboardingListPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters((prevState: OnboardingFilterType | null) => ({
              ...prevState!,
              take: newPageSize,
            }))
            setOnboardingListPageSize(newPageSize)
          }}
        /> */}
      </Box>
    </Card>
  )
}
