import { Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import { Dispatch, SetStateAction } from 'react'

import { columns } from '@src/pages/onboarding/components/onboarding-columns'
import { OnboardingListType } from 'src/types/onboarding/list'

type Props = {
  onboardingListPage: number
  setOnboardingListPage: Dispatch<SetStateAction<number>>
  onboardingListPageSize: number
  setOnboardingListPageSize: Dispatch<SetStateAction<number>>
  onboardingProList: OnboardingListType[]
  onboardingProListCount: number
}

export default function OnboardingList({
  onboardingListPage,
  setOnboardingListPage,
  onboardingListPageSize,
  setOnboardingListPageSize,
  onboardingProList,
  onboardingProListCount,
}: Props) {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={`Pros (${onboardingProListCount})`}
          sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
        ></CardHeader>
        <Box
          sx={{
            width: '100%',
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
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
            rows={onboardingProList ?? []}
            autoHeight
            disableSelectionOnClick
            pageSize={onboardingListPageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            page={onboardingListPage}
            rowCount={onboardingProListCount}
            onPageChange={(newPage: number) => {
              setOnboardingListPage(newPage)
            }}
            onPageSizeChange={(newPageSize: number) =>
              setOnboardingListPageSize(newPageSize)
            }
          />
        </Box>
      </Card>
    </Grid>
  )
}
