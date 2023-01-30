import { Button, Card, Grid, Typography } from '@mui/material'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import
import { rows2 } from 'src/@fake-db/table/static-data'
import Link from 'next/link'
import { JobInfoType } from 'src/types/sign/personalInfoTypes'

import styled from 'styled-components'

type CellType = {
  row: {
    id: string
    full_name: string
    email: string
    firstName: string
    middleName?: string
    lastName: string
    jobInfo: Array<JobInfoType>
    experience: string
    testStatus: string
    isOnboarded: boolean
  }
}

export default function OnboardingList() {
  function getLegalName(row: {
    id: string
    full_name: string
    email: string
    firstName: string
    middleName?: string
    lastName: string
    jobInfo: Array<JobInfoType>
    experience: string
    testStatus: string
    isOnboarded: boolean
  }) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? '(' + row.middleName + ')' : null) +
          row.lastName
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
      field: 'firstName',
      headerName: 'Legal name / Email',
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <Box>
              <Link
                href={`/apps/invoice/preview/${row.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography sx={{ fontWeight: '600', fontSize: '1rem' }}>
                  {getLegalName(row)}
                </Typography>
              </Link>
              <Typography variant='body2'>{row.email}</Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'experience',
      headerName: 'Experience',
      renderHeader: () => <Box>Experience</Box>,
    },
    {
      flex: 0.3,

      minWidth: 130,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      renderHeader: () => <Box>Job type / Role</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflow: 'scroll', display: 'flex', gap: '8px' }}>
          {!row?.jobInfo.length
            ? '-'
            : row?.jobInfo.map(
                (item, idx) =>
                  idx === 0 && (
                    <Box key={row.id} sx={{ display: 'flex', gap: '8px' }}>
                      <Chip>{item.jobType}</Chip>
                      <Chip>{item.role}</Chip>
                    </Box>
                  ),
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
      flex: 0.1,
      field: 'age',
      minWidth: 80,
      headerName: 'testStatus',
      renderHeader: () => <Box>Test status</Box>,
      renderCell: ({ row }: CellType) => (
        <Box>
          {!row.testStatus ? '-' : <StatusChip>{row.testStatus}</StatusChip>}
        </Box>
      ),
    },
  ]
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Pros (1,032)' />
        <Box sx={{ height: 500 }}>
          <DataGrid columns={columns} rows={rows2.slice(0, 10)} />
        </Box>
      </Card>
    </Grid>
  )
}

const Chip = styled.p`
  padding: 3px 4px;
  background: #beefae;
  border-radius: 16px;

  color: rgba(17, 17, 17, 0.87);
  font-weight: 500;
  font-size: 0.813rem;
`
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
  padding: 3px 4px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #d18a00;
  border-radius: 16px;

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
