import { Icon } from '@iconify/react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { ProAppliedRolesStatusChip } from '@src/@core/components/chips/chips'
import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import JobTypeRole from '@src/pages/components/job-type-role-chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import {
  ProAppliedRolesStatusHistoryType,
  ProAppliedRolesType,
} from '@src/types/pro/pro-applied-roles'
import { Loadable } from 'recoil'

export const getProAppliedRolesColumns = (
  statusList: {
    value: number
    label: string
  }[],
  role: UserRoleType,
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
  viewHistory: (history: ProAppliedRolesStatusHistoryType[]) => void,
  onClickStartTest: (row: ProAppliedRolesType) => void,
  onClickReason: (row: ProAppliedRolesType) => void,
  onClickTestGuideLine: (row: ProAppliedRolesType) => void,
  onClickResume: (row: ProAppliedRolesType) => void,
  onClickSubmit: (row: ProAppliedRolesType) => void,
  onClickDecline: (row: ProAppliedRolesType) => void,
  onClickAccept: (row: ProAppliedRolesType) => void,
) => {
  const cannotTestStatus = [
    'Awaiting approval',
    'Rejected by TAD',
    'Test declined',
    'Role declined',
    'Paused',
    'Basic failed',
    'Basic passed',
    'Skill failed',
    'Contract required',
    'Certified',
  ]

  const canTestStatus = ['Basic test Ready', 'Skill test Ready']
  const resumeTestStatus = ['Basic in progress', 'Skill in progress']
  const afterSubmitTestStatus = ['Basic submitted', 'Skill submitted']
  const assignedTestStatus = ['Test assigned', 'Role assigned']

  const columns: GridColumns<ProAppliedRolesType> = [
    {
      flex: 0.1824,
      minWidth: 300,
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
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <JobTypeRole jobInfo={[{ jobType: row.jobType, role: row.role }]} />
        )
      },
    },

    {
      flex: 0.1398,
      minWidth: 230,
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
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {row.sourceLanguage &&
            row.targetLanguage &&
            row.sourceLanguage !== '' &&
            row.targetLanguage !== '' ? (
              <>
                {row.sourceLanguage.toUpperCase()} &rarr;{' '}
                {row.targetLanguage.toUpperCase()}
              </>
            ) : null}
          </Typography>
        )
      },
    },
    {
      flex: 0.1216,
      minWidth: 200,
      field: 'score',
      headerName: 'Score',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Score
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <>
            {row.status === 'Basic test Ready' ||
            row.status === 'Basic in progress' ||
            row.status === 'Test assigned' ||
            row.status === 'Role assigned' ||
            row.status === 'Test in preparation' ||
            row.status === 'Awaiting approval' ||
            row.status === 'Paused' ||
            row.status === 'Rejected by TAD' ||
            row.status === 'Test declined' ||
            row.status === 'Role declined' ? (
              <Typography
                variant='body2'
                fontSize={16}
                color='rgba(76, 78, 100, 0.38)'
              >
                -
              </Typography>
            ) : row.status === 'Certified' &&
                row.basicTest === null &&
                row.skillTest === null ? null : (
              <>
                <Typography
                  // component={'span'}
                  variant='body1'
                  fontWeight={row.basicTest?.isPassed !== null ? 600 : 400}
                  color={
                    row.basicTest?.isPassed === null
                      ? 'rgba(76, 78, 100, 0.38)'
                      : row.basicTest?.isPassed
                        ? '#72E128'
                        : '#FF4D49'
                  }
                >
                  Basic:{' '}
                  {row.basicTest?.isPassed === null
                    ? row.basicTest?.isSkipped
                      ? '→'
                      : '-'
                    : row.basicTest?.isPassed
                      ? 'P'
                      : 'F'}
                </Typography>{' '}
                <Typography
                  variant='body1'
                  fontWeight={400}
                  color={'rgba(76, 78, 100, 0.38)'}
                >
                  &nbsp;/&nbsp;
                </Typography>
                <Typography
                  variant='body2'
                  fontWeight={row.skillTest?.isPassed !== null ? 600 : 400}
                  fontSize={16}
                  color={
                    row.skillTest?.isPassed === null
                      ? 'rgba(76, 78, 100, 0.38)'
                      : row.skillTest?.isPassed
                        ? '#72E128'
                        : '#FF4D49'
                  }
                >
                  Skill:{' '}
                  {row.skillTest?.isPassed === null
                    ? '-'
                    : row.skillTest?.isPassed
                      ? 'P'
                      : 'F'}
                </Typography>
              </>
            )}
          </>
        )
      },
    },
    {
      flex: 0.1398,
      minWidth: 230,
      field: 'status',

      headerName: 'Status',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <Box sx={{ display: 'flex', gap: '7px' }}>
            {ProAppliedRolesStatusChip(row.status!, row.status)}
            {row.status === 'Test in preparation' ||
            row.status === 'Rejected by TAD' ||
            (row.basicTest?.isSkipped && row.status === 'Skill test Ready') ||
            (!row.basicTest?.isPassed && row.status === 'Skill test Ready') ||
            row.status === 'Basic failed' ||
            row.status === 'Skill failed' ||
            row.status === 'Test assigned' ||
            row.status === 'Role assigned' ||
            row.status === 'Paused' ? (
              <IconButton
                onClick={() => {
                  onClickReason(row)
                  // project.reason && onClickReason()
                }}
                sx={{ padding: 0 }}
              >
                <img
                  src='/images/icons/onboarding-icons/more-reason.svg'
                  alt='more'
                />
              </IconButton>
            ) : null}
          </Box>
        )
      },
    },
    {
      flex: 0.1672,
      minWidth: 275,
      field: 'action',
      headerName: 'Action',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Action
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <Box>
            {cannotTestStatus.includes(row.status) ? (
              '-'
            ) : canTestStatus.includes(row.status) ? (
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Button
                  variant='contained'
                  sx={{ minWidth: '201px' }}
                  onClick={() => onClickStartTest(row)}
                >
                  Start test
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    width: 28,
                    height: 28,
                    minWidth: '28px !important',
                    padding: '0px !important',
                  }}
                  onClick={() => onClickTestGuideLine(row)}
                >
                  <Icon
                    icon='fluent:book-information-24-regular'
                    fontSize={20}
                  />
                </Button>
              </Box>
            ) : resumeTestStatus.includes(row.status) ? (
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Button variant='outlined' onClick={() => onClickResume(row)}>
                  Resume
                </Button>
                <Button variant='contained' onClick={() => onClickSubmit(row)}>
                  Submit
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    width: 28,
                    height: 28,
                    minWidth: '28px !important',
                    padding: '0px !important',
                  }}
                  onClick={() => onClickTestGuideLine(row)}
                >
                  <Icon
                    icon='fluent:book-information-24-regular'
                    fontSize={20}
                  />
                </Button>
              </Box>
            ) : afterSubmitTestStatus.includes(row.status) ? (
              <Box>
                <Icon icon='mdi:check' fontSize={20} color='#666CFF' />
              </Box>
            ) : assignedTestStatus.includes(row.status) ? (
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Button variant='outlined' onClick={() => onClickDecline(row)}>
                  Declined
                </Button>
                <Button variant='contained' onClick={() => onClickAccept(row)}>
                  Accept
                </Button>
              </Box>
            ) : (
              '-'
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.1581,
      minWidth: 260,
      field: 'testStartedAt',

      headerName: 'Test start time',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Test start time
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              row.status === 'Basic in progress'
                ? row.basicTest?.testStartedAt
                : row.status === 'Skill in progress'
                  ? row.skillTest?.testStartedAt
                  : null,
              auth.getValue().user?.timezone!,
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.0912,
      minWidth: 150,
      field: 'history',

      headerName: 'History',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      align: 'center',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          History
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesType }) => {
        return (
          <Box>
            <Button
              variant='outlined'
              onClick={() => viewHistory(row.statusHistory)}
            >
              View
            </Button>
          </Box>
        )
      },
    },
  ]

  return columns
}

export const getProAppliedRolesStatusHistoryColumns = (
  statusList: {
    value: number
    label: string
  }[],
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
) => {
  const columns: GridColumns<ProAppliedRolesStatusHistoryType> = [
    {
      flex: 0.4694,
      minWidth: 230,
      field: 'status',

      headerName: 'Status',
      disableColumnMenu: true,
      sortable: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesStatusHistoryType }) => {
        // const label = statusList?.find(i => i.value === row.status)?.label
        return <Box>{ProAppliedRolesStatusChip(row.status!, row.status)}</Box>
      },
    },
    {
      flex: 0.5306,
      minWidth: 249,
      field: 'date',
      headerName: 'Date & Time',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Date & Time
        </Typography>
      ),
      renderCell: ({ row }: { row: ProAppliedRolesStatusHistoryType }) => {
        return (
          <Typography variant='body1' fontSize={14} fontWeight={400}>
            {FullDateTimezoneHelper(
              row.updatedAt,
              auth.getValue().user?.timezone!,
            )}
          </Typography>
        )
      },
    },
  ]

  return columns
}
