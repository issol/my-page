import { Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ProStatusChip,
  RequestHistoryStatusChip,
  assignmentStatusChip,
} from '@src/@core/components/chips/chips'
import LegalNameEmail from 'src/pages/[companyName]/onboarding/components/list/list-item/legalname-email'

type CellType = {
  row: {
    jobRequestId: number
    userId: number
    firstName: string
    middleName: string
    lastName: string
    email: string
    assignmentStatus: number
    assignmentStatusUpdatedAt: string
    responseStatusCodeOfPro: number
    order: number
    isOnboarded: boolean
    isActive: boolean
  }
}

export const getJobRequestedProColumns = (
  jobStatusList: {
    value: number
    label: string
  }[],
) => {
  const columns: GridColumns<{
    jobRequestId: number
    userId: number
    firstName: string
    middleName: string
    lastName: string
    email: string
    assignmentStatus: number
    assignmentStatusUpdatedAt: string
    responseStatusCodeOfPro: number
    order: number
    isOnboarded: boolean
    isActive: boolean
  }> = [
    {
      field: 'name',
      flex: 0.5,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Legal name / Email
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,

              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
            // link={`/pro/detail/${row.userId}`}
          />
        )
      },
    },
    {
      field: 'status',
      flex: 0.5,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Response
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <>
            {row.responseStatusCodeOfPro === null ? (
              '-'
            ) : (
              <>
                {RequestHistoryStatusChip(
                  row.responseStatusCodeOfPro === 70150
                    ? 70100
                    : row.responseStatusCodeOfPro === 70450
                      ? 70400
                      : row.responseStatusCodeOfPro,
                  jobStatusList,
                )}
              </>
            )}
          </>
        )
      },
    },
  ]

  return columns
}
