import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  OnboardingListCellType,
  OnboardingUserType,
} from 'src/types/onboarding/list'
import LegalNameEmail from 'src/pages/onboarding/components/list/list-item/legalname-email'
import JobTypeRole from 'src/pages/onboarding/components/list/list-item/jobtype-role'
import TestStatus from 'src/pages/onboarding/components/list/list-item/test-status'
import { GridColumns } from '@mui/x-data-grid'

export const columns: GridColumns<OnboardingUserType> = [
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
    renderCell: ({ row }: OnboardingListCellType) => {
      return <LegalNameEmail row={row} />
    },
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'experience',
    headerName: 'Experience',
    renderHeader: () => <Box>Experience</Box>,
    renderCell: ({ row }: OnboardingListCellType) => {
      return <Typography variant='body1'>{row.experience}</Typography>
    },
  },
  {
    flex: 0.4,
    minWidth: 180,
    field: 'jobInfo',
    headerName: 'Job type / Role',
    renderHeader: () => <Box>Job type / Role</Box>,
    renderCell: ({ row }: OnboardingListCellType) => {
      return <JobTypeRole row={row} />
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'languages',
    headerName: 'Language pair',
    renderHeader: () => <Box>Language pair</Box>,
    renderCell: ({ row }: OnboardingListCellType) => (
      <Box>
        {!row.jobInfo.length ? (
          '-'
        ) : (
          <Box key={row.id}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              {row.jobInfo[0].source && row.jobInfo[0].target ? (
                <>
                  {row.jobInfo[0].source} &rarr; {row.jobInfo[0].target}
                </>
              ) : (
                '-'
              )}
            </Typography>
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
    renderCell: ({ row }: OnboardingListCellType) => {
      return <TestStatus row={row} />
    },
  },
]
