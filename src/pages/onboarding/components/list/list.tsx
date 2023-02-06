import { Button, Card, Grid, Typography } from '@mui/material'
import Chip from 'src/@core/components/mui/chip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import
import { onboardingData, rows2 } from 'src/@fake-db/table/static-data'
import Link from 'next/link'
import { JobInfoType } from 'src/types/sign/personalInfoTypes'

import styled from 'styled-components'
import JobTypeRoleChips from 'src/@core/components/jobtype-role-chips'
import { OnboardingListType } from 'src/types/onboarding/list'
import { TestStatusColor } from 'src/shared/const/chipColors'
import { Dispatch, SetStateAction } from 'react'

type CellType = {
  row: OnboardingListType
}

type Props = {
  onboardingListPage: number
  setOnboardingListPage: Dispatch<SetStateAction<number>>
  onboardingListPageSize: number
  setOnboardingListPageSize: Dispatch<SetStateAction<number>>
}

export default function OnboardingList({
  onboardingListPage,
  setOnboardingListPage,
  onboardingListPageSize,
  setOnboardingListPageSize,
}: Props) {
  function getLegalName(row: OnboardingListType) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? ' (' + row.middleName + ')' : '') +
          ` ${row.lastName}`
  }
  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'No.',
      renderHeader: () => <Box>No.</Box>,
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: 'Legal name / Email',
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <img
              width={34}
              height={34}
              alt=''
              aria-hidden
              src={`${
                row.isOnboarded
                  ? '/images/icons/project-icons/onboarding-activate.png'
                  : '/images/icons/project-icons/onboarding-deactivate.png'
              }`}
            />
            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Link
                href={`/onboarding/detail/${row.userId}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  sx={{
                    fontWeight: '600',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {getLegalName(row)}
                </Typography>
              </Link>
              <Typography
                variant='body2'
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'experience',
      headerName: 'Experience',
      renderHeader: () => <Box>Experience</Box>,
    },
    {
      flex: 0.4,
      minWidth: 180,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      renderHeader: () => <Box>Job type / Role</Box>,
      renderCell: ({ row }: CellType) => (
        <Box
          sx={{
            overflow: 'scroll',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {!row?.jobInfo.length
            ? '-'
            : row?.jobInfo.map(
                (item, idx) => idx === 0 && <JobTypeRoleChips jobInfo={item} />,
              )}
          {row?.jobInfo.length > 1 ? (
            <CountChip>+{row.jobInfo.length - 1}</CountChip>
          ) : null}
        </Box>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'languages',
      headerName: 'Language pair',
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: CellType) => (
        <Box>
          {!row.jobInfo.length ? (
            '-'
          ) : (
            <Box key={row.id}>
              <Language>
                {row.jobInfo[0].source} &rarr; {row.jobInfo[0].target}
              </Language>
            </Box>
          )}
        </Box>
      ),
    },
    {
      flex: 0.17,
      field: 'age',
      minWidth: 80,
      headerName: 'testStatus',
      renderHeader: () => <Box>Test status</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflow: 'scroll' }}>
          {!row.testStatus ? (
            '-'
          ) : (
            <Chip
              size='medium'
              type='testStatus'
              label={row.testStatus}
              /* @ts-ignore */
              customColor={TestStatusColor[row.testStatus]}
              sx={{
                textTransform: 'capitalize',
                '& .MuiChip-label': { lineHeight: '18px' },
                mr: 1,
              }}
            />
          )}
        </Box>
      ),
    },
  ]
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={`Pros (${onboardingData.length})`}
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
            // rowHeight={70}
            rows={onboardingData ?? []}
            autoHeight
            disableSelectionOnClick
            pageSize={onboardingListPageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            page={onboardingListPage}
            rowCount={onboardingData.length}
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
const CountChip = styled.p`
  padding: 3px 4px;
  text-align: center;
  width: 40px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #6d788d;
  border: 1px solid rgba(76, 78, 100, 0.6);
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.813rem;
`

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
