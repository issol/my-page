import { Card, Grid, Typography, LinearProgress } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid-pro'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import { Dispatch, SetStateAction } from 'react'

import {
  OnboardingFilterType,
  OnboardingListType,
} from '@src/types/onboarding/list'
import { NoList } from '@src/pages/components/no-list'

type Props = {
  onboardingListPage: number
  setOnboardingListPage: Dispatch<SetStateAction<number>>
  onboardingListPageSize: number
  setOnboardingListPageSize: Dispatch<SetStateAction<number>>
  onboardingProList: OnboardingListType[]
  onboardingProListCount: number
  setFilters: Dispatch<SetStateAction<OnboardingFilterType | null>>
  columns: GridColDef[]
  isLoading: boolean
  handleRowClick: (id: number) => void
}

export default function OnboardingList({
  onboardingListPage,
  setOnboardingListPage,
  onboardingListPageSize,
  setOnboardingListPageSize,
  onboardingProList,
  onboardingProListCount,
  setFilters,
  columns,
  isLoading,
  handleRowClick,
}: Props) {
  const apiRef = useGridApiRef()

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          borderRadius: '0 0 16px 16px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 'calc(97vh - 323px)',
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
            }}
            slots={{
              noRowsOverlay: () => NoList('There are no Pros'),
              loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
            }}
            // components={{
            //   NoRowsOverlay: () => {
            //     return (
            //       <Box
            //         sx={{
            //           width: '100%',
            //           height: '100%',
            //           display: 'flex',
            //           justifyContent: 'center',
            //           alignItems: 'center',
            //         }}
            //       >
            //         <Typography variant='subtitle1'>
            //           There are no Pros
            //         </Typography>
            //       </Box>
            //     )
            //   },
            //   NoResultsOverlay: () => {
            //     return (
            //       <Box
            //         sx={{
            //           width: '100%',
            //           height: '100%',
            //           display: 'flex',
            //           justifyContent: 'center',
            //           alignItems: 'center',
            //         }}
            //       >
            //         <Typography variant='subtitle1'>
            //           There are no Pros
            //         </Typography>
            //       </Box>
            //     )
            //   },
            // }}
            onCellClick={params => {
              if (params.field !== 'resume') handleRowClick(params.row.userId)
            }}
            initialState={{
              pinnedColumns: { left: ['id', 'name'], right: ['actions'] },
            }}
            columns={columns}
            rowHeight={40}
            loading={isLoading}
            rows={onboardingProList ?? []}
            // disableSelectionOnClick
            paginationMode='server'
            // pageSize={onboardingListPageSize}
            // rowsPerPageOptions={[5, 10, 25, 50]}
            // page={onboardingListPage}
            rowCount={onboardingProListCount}
            hideFooter
            // onPageChange={(newPage: number) => {
            //   setFilters((prevState: OnboardingFilterType | null) => ({
            //     ...prevState!,
            //     skip: newPage * onboardingListPageSize,
            //   }))
            //   setOnboardingListPage(newPage)
            // }}
            // onPageSizeChange={(newPageSize: number) => {
            //   setFilters((prevState: OnboardingFilterType | null) => ({
            //     ...prevState!,
            //     take: newPageSize,
            //   }))
            //   setOnboardingListPageSize(newPageSize)
            // }}
          />
        </Box>
      </Card>
    </Grid>
  )
}
