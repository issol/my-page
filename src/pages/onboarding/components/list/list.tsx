import { Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import { Dispatch, SetStateAction } from 'react'

import {
  OnboardingFilterType,
  OnboardingListType,
} from '@src/types/onboarding/list'

type Props = {
  onboardingListPage: number
  setOnboardingListPage: Dispatch<SetStateAction<number>>
  onboardingListPageSize: number
  setOnboardingListPageSize: Dispatch<SetStateAction<number>>
  onboardingProList: OnboardingListType[]
  onboardingProListCount: number
  setFilters: Dispatch<SetStateAction<OnboardingFilterType>>
  columns: GridColumns<OnboardingListType>
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
            height: {
              lg: 'calc(97vh - 323px)', // 1075px 이상
              md: 'calc(97vh - 398px)', // 1075px 이하
              sm: 'calc(97vh - 398px)', // 1075px 이하
              xs: 'calc(97vh - 500px)', // 1075px 이하
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            sx={{
              cursor: 'pointer',
              '& .MuiDataGrid-columnHeaders': {
                borderTop: '1px solid #4C4E6412'  // 회색 상단 보더 설정
              }
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
                    <Typography variant='subtitle1'>
                      There are no Pros
                    </Typography>
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
                    <Typography variant='subtitle1'>
                      There are no Pros
                    </Typography>
                  </Box>
                )
              },
            }}
            onCellClick={params => {
              if (params.field !== 'resume')handleRowClick(params.row.userId)
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
              setFilters((prevState: OnboardingFilterType) => ({
                ...prevState,
                skip: newPage * onboardingListPageSize,
              }))
              setOnboardingListPage(newPage)
            }}
            onPageSizeChange={(newPageSize: number) => {
              setFilters((prevState: OnboardingFilterType) => ({
                ...prevState,
                take: newPageSize,
              }))
              setOnboardingListPageSize(newPageSize)
            }}
          />
        </Box>
      </Card>
    </Grid>
  )
}
