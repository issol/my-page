import { Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import styled from 'styled-components'

import { Dispatch, SetStateAction } from 'react'
import { onboardingUser } from 'src/@fake-db/user'

import { columns } from 'src/shared/const/onboarding'
import { OnboardingListType } from 'src/types/onboarding/list'

type Props = {
  onboardingListPage: number
  setOnboardingListPage: Dispatch<SetStateAction<number>>
  onboardingListPageSize: number
  setOnboardingListPageSize: Dispatch<SetStateAction<number>>
  onboardingProList: OnboardingListType[]
}

export default function OnboardingList({
  onboardingListPage,
  setOnboardingListPage,
  onboardingListPageSize,
  setOnboardingListPageSize,
  onboardingProList,
}: Props) {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={`Pros (${onboardingUser.length})`}
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
            rowCount={onboardingProList.length}
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

// ** TODO : chip style 컬러 추가해야 함
// const Chip = styled.p`
//   padding: 3px 4px;
//   background: #beefae;
//   border-radius: 16px;

//   color: rgba(17, 17, 17, 0.87);
//   font-weight: 500;
//   font-size: 0.813rem;
// `

const StatusChip = styled.p`
  padding: 4px 8px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #d18a00;
  border-radius: 16px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  color: #d18a00;
`
const Language = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  letter-spacing: 0.15px;
  color: rgba(76, 78, 100, 0.87);
`
