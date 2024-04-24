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
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            sx={{
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
            columns={columns}
            rowHeight={40}
            loading={isLoading}
            rows={onboardingProList ?? []}
            autoHeight
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
