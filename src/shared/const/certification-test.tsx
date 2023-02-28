import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { GridColumns } from '@mui/x-data-grid'
import JobTypeRole from 'src/pages/onboarding/components/list/list-item/jobtype-role'
import { TestMaterialListType } from 'src/types/certification-test/list'
import { FullDateTimezoneHelper } from '../helpers/date.helper'

export const materialColumns: GridColumns<TestMaterialListType> = [
  {
    flex: 0.25,
    minWidth: 200,
    field: 'testType',
    headerName: 'Test type',
    renderHeader: () => <Box>Test type</Box>,
    renderCell: ({ row }: { row: TestMaterialListType }) => {
      return <Box>{row.testType}</Box>
    },
  },

  {
    flex: 0.4,
    minWidth: 180,
    field: 'jobInfo',
    headerName: 'Job type / Role',
    renderHeader: () => <Box>Job type / Role</Box>,
    renderCell: ({ row }: { row: TestMaterialListType }) => {
      return (
        <JobTypeRole jobInfo={[{ jobType: row.jobType, role: row.role }]} />
      )
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'languages',
    headerName: 'Language pair',
    renderHeader: () => <Box>Language pair</Box>,
    renderCell: ({ row }: { row: TestMaterialListType }) => (
      <Box>
        <Box key={row.id}>
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {row.source === '' ? (
              row.target.toUpperCase()
            ) : (
              <>
                {row.source} &rarr; {row.target}
              </>
            )}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    flex: 0.17,
    field: 'age',
    minWidth: 80,
    headerName: 'Date & Time',
    renderHeader: () => <Box>Date & Time</Box>,
    renderCell: ({ row }: { row: TestMaterialListType }) => {
      return <Box>{FullDateTimezoneHelper(row.updatedAt)}</Box>
    },
  },
]
