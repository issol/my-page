import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { CountryType, TimeZoneType } from '@src/types/sign/personalInfoTypes'
import TestTypeChip from 'src/pages/[companyName]/certification-test/components/list/list-item/test-type-chip'
import JobTypeRole from 'src/pages/[companyName]/components/job-type-role-chips'

import { TestMaterialListType } from '@src/types/certification-test/list'
import { convertTimeToTimezone } from '../../helpers/date.helper'
import { GridColDef } from '@mui/x-data-grid'

export const getColumns = (
  timezone: CountryType,
  timezoneList: TimeZoneType[],
) => {
  const materialColumns: GridColDef[] = [
    {
      flex: 0.12,
      minWidth: 100,
      field: 'testType',
      headerName: 'Test type',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box>Test type</Box>,
      renderCell: ({ row }: { row: TestMaterialListType }) => {
        return <TestTypeChip testType={row.testType} />
      },
    },

    {
      flex: 0.3,
      minWidth: 180,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => <Box>Job type / Role</Box>,
      renderCell: ({ row }: { row: TestMaterialListType }) => {
        if (row.testType === 'skill') {
          return (
            <JobTypeRole jobInfo={[{ jobType: row.jobType, role: row.role }]} />
          )
        }
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'languages',
      headerName: 'Language pair',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: { row: TestMaterialListType }) => (
        <Box>
          <Box key={row.id}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              {row.testType === 'skill' ? (
                <>
                  {row.source &&
                  row.target &&
                  row.source !== '' &&
                  row.target !== '' ? (
                    <>
                      {row.source.toUpperCase()} &rarr;{' '}
                      {row.target.toUpperCase()}
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {row.target && row.target !== ''
                    ? row.target.toUpperCase()
                    : null}
                </>
              )}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.17,
      field: 'updatedAt',
      minWidth: 80,
      headerName: 'Date & Time',
      disableColumnMenu: true,
      sortable: true,
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: { row: TestMaterialListType }) => {
        return (
          <Box>
            {convertTimeToTimezone(row.updatedAt, timezone, timezoneList)}
          </Box>
        )
      },
    },
  ]

  return materialColumns
}
