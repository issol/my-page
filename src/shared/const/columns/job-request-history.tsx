import { Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { ClientUserType, UserDataType } from '@src/context/types'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { JobRequestHistoryType } from '@src/types/jobs/jobs.type'
import { TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { Loadable } from 'recoil'

type CellType = {
  row: JobRequestHistoryType
}

export const getJobRequestHistoryColumns = (
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
  timezoneList: TimeZoneType[],
) => {
  const columns: GridColumns<JobRequestHistoryType> = [
    {
      field: 'round',
      flex: 0.1724,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Round
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontSize={14} variant='body1' fontWeight={400}>
            Round {row.round}
          </Typography>
        )
      },
    },
    {
      field: 'requestType',
      flex: 0.2989,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Request option
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontSize={14} variant='body1' fontWeight={400}>
            {row.requestType === 'relayRequest'
              ? 'Relay request'
              : row.requestType === 'bulkManualAssign'
                ? 'Mass request (Manual assignment)'
                : row.requestType === 'bulkAutoAssign'
                  ? 'Mass request (First come first serve)'
                  : '-'}
          </Typography>
        )
      },
    },
    {
      field: 'requestor',
      flex: 0.2682,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Requestor
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontSize={14} variant='body1' fontWeight={400}>
            {row.requestor}
          </Typography>
        )
      },
    },
    {
      field: 'requestedAt',
      flex: 0.2682,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Date&Time
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontSize={14} variant='body1' fontWeight={400}>
            {convertTimeToTimezone(
              row.requestedAt,
              auth.getValue().user?.timezone,
              timezoneList,
            )}
          </Typography>
        )
      },
    },
  ]

  return columns
}
