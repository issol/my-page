import { Box, Button, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import JobTypeRole from '@src/pages/components/job-type-role-chips'
import { ProCertificationTestListType } from '@src/types/pro-certification-test/certification-test'

export const getProCertificationTestListColumns = (
  onClickApply: (row: ProCertificationTestListType) => void,
) => {
  const columns: GridColumns<ProCertificationTestListType> = [
    {
      flex: 0.448,
      minWidth: 560,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job type / Role
        </Typography>
      ),
      renderCell: ({ row }: { row: ProCertificationTestListType }) => {
        return (
          <JobTypeRole jobInfo={[{ jobType: row.jobType, role: row.role }]} />
        )
      },
    },

    {
      flex: 0.384,
      minWidth: 480,
      field: 'languagePair',
      headerName: 'Language pair',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Language pair
        </Typography>
      ),
      renderCell: ({ row }: { row: ProCertificationTestListType }) => {
        return (
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {row.source &&
            row.target &&
            row.source !== '' &&
            row.target !== '' ? (
              <>
                {row.source.toUpperCase()} &rarr; {row.target.toUpperCase()}
              </>
            ) : null}
          </Typography>
        )
      },
    },
    {
      flex: 0.168,
      minWidth: 210,
      field: 'action',

      headerName: 'Action',
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Action
        </Typography>
      ),
      renderCell: ({ row }: { row: ProCertificationTestListType }) => {
        return (
          <Box>
            <Button variant='contained' onClick={() => onClickApply(row)}>
              Apply
            </Button>
          </Box>
        )
      },
    },
  ]
  return columns
}
