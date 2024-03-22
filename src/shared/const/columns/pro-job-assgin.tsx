import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  GridColumns,
  GridInputSelectionModel,
  GridRowId,
  GridSelectionModel,
} from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import {
  ProStatusChip,
  assignmentStatusChip,
} from '@src/@core/components/chips/chips'
import { ClientUserType, UserDataType } from '@src/context/types'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { JobRequestsProType } from '@src/types/jobs/jobs.type'
import { AssignProListType } from '@src/types/orders/job-detail'
import { ProListCellType, ProListType } from '@src/types/pro/list'
import { TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction } from 'react'
import { Loadable } from 'recoil'
import Image from 'next/image'

type CellType = {
  row: ProListType | AssignProListType
}

type ProAssignJobCellType = {
  row: JobRequestsProType
}

export const getProJobAssignColumns = (
  isPrioritized: boolean,
  searchPro: boolean,
  requestPro: boolean,
  assignPro: boolean,
  addRound: boolean,
  addPros: boolean,
  selectedValue?: GridSelectionModel,
  setSelectedValue?: Dispatch<
    SetStateAction<{ [key: string]: GridSelectionModel }>
  >,
  label?: string,
  setSelectedRows?: Dispatch<
    SetStateAction<{
      [key: string]: {
        data: Array<ProListType | AssignProListType>
        isPrivate?: boolean | undefined
        isPrioritized?: boolean | undefined
      }
    }>
  >,
  proList?: Array<ProListType | AssignProListType>,
) => {
  const columns: GridColumns<ProListType | AssignProListType> = [
    {
      field: 'select',
      flex: 0.0755,
      hide: !assignPro,
      renderHeader: () => <></>,
      renderCell: ({ row }: CellType) => {
        return (
          <Radio
            checked={
              // selectedValue &&
              Number(selectedValue) === row.userId
            }
            onChange={() => {
              console.log(proList)

              const selectedPros =
                proList?.filter(pro => pro.userId === row.userId) ?? []
              console.log(selectedPros)

              setSelectedValue &&
                setSelectedValue(prev => ({
                  ...{
                    [label ?? '']: [row.userId],
                  },
                }))

              setSelectedRows &&
                setSelectedRows(prev => ({
                  ...{
                    [label ?? '']: {
                      data: selectedPros,
                      isPrivate: false,
                      isPrioritized: false,
                    },
                  },
                }))
            }}
            value={
              selectedValue &&
              Number((selectedValue as GridRowId[])[0]) === row.userId
            }
            name='radio-button-demo'
            inputProps={{ 'aria-label': 'A' }}
          />
        )
      },
    },
    {
      field: 'order',

      flex: requestPro ? 0.0936 : 0.0503,
      // disableColumnMenu: true,
      hide: !isPrioritized || searchPro,
      renderHeader: () => (
        // <Icon
        //   icon='mdi:arrow-up'
        //   color='rgba(76, 78, 100, 0.54)'
        //   fontSize={20}
        // />
        <></>
      ),

      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
            {(row as ProListType).order}
          </Typography>
        )
      },
    },
    {
      field: 'name',

      flex: requestPro ? 0.3974 : 0.4025,
      headerName: 'Legal name / Email',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Legal name / Email
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',

              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <LegalNameEmail
              row={{
                isOnboarded: row.isOnboarded,
                isActive: row.isActive,

                firstName: row.firstName,
                middleName: row.middleName,
                lastName: row.lastName,
                email: row.email,
              }}
            />
            {assignPro || addPros || addRound ? (
              <Box>
                <Image
                  src={`/images/icons/job-icons/status-${(row as AssignProListType).responseLight === 70100 ? 'green' : (row as AssignProListType).responseLight === 70000 || (row as AssignProListType).responseLight === 70500 || (row as AssignProListType).responseLight === 70600 ? 'orange' : (row as AssignProListType).responseLight === 70200 || ((row as AssignProListType).responseLight === 70400 && 'red')}.svg`}
                  alt=''
                  width={8}
                  height={8}
                />
              </Box>
            ) : null}
          </Box>
        )
      },
    },

    {
      flex: requestPro ? 0.2308 : 0.2264,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <ProStatusChip status={row.status} label={row.status} />
      },
    },
    {
      flex: 0.2,
      field: 'avg',
      hideSortIcons: true,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      hide: !searchPro && !assignPro && !addRound,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Avg. response time
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <Typography> 10 min(s)</Typography>
      },
    },
    {
      flex: searchPro || assignPro ? 0.1635 : requestPro ? 0.2782 : 0.2453,
      field: 'jobs',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Ongoing jobs
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={
              <ul
                style={{
                  paddingLeft: 18,
                  maxWidth: '170px',
                  minWidth: '100px',
                }}
              >
                {(row as AssignProListType).ongoingJobList?.map(value => {
                  return <li key={uuidv4()}>{value}</li>
                })}{' '}
              </ul>
            }
          >
            <Typography>
              {row.ongoingJobCount ? `${row.ongoingJobCount} job(s)` : '-'}
            </Typography>
          </Tooltip>
        )
      },
    },
  ]

  return columns
}

export const getProJobAssignColumnsForRequest = (
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
  timezoneList: TimeZoneType[],
  requestCompleted: boolean,
  detailAnchorEl: HTMLElement | null,
  handleDetailClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
    },
  ) => void,
  handleDetailClose: () => void,
  onClickAssign: (
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
    },
    requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  ) => void,
  onClickCancel: (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
  }) => void,
  onClickReAssign: (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
  }) => void,
  onClickMessage: (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
  }) => void,
  requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  jobStatusList: {
    value: number
    label: string
  }[],
  selectedUser: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
  },
) => {
  const columns: GridColumns<JobRequestsProType> = [
    {
      field: 'order',

      flex: 0.0369,
      disableColumnMenu: true,
      sortable: false,

      renderHeader: () => <></>,

      renderCell: ({ row }: ProAssignJobCellType) => {
        return (
          <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
            {row.order}
          </Typography>
        )
      },
    },

    {
      field: 'name',

      flex: 0.2949,
      headerName: 'Legal name / Email',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Legal name / Email
        </Typography>
      ),
      renderCell: ({ row }: ProAssignJobCellType) => {
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
          />
        )
      },
    },
    {
      flex: 0.1935,
      field: 'status',
      headerName: 'Assignment status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,

      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Assignment status
        </Typography>
      ),
      renderCell: ({ row }: ProAssignJobCellType) => {
        return (
          <>
            {row.assignmentStatus === null ? (
              '-'
            ) : (
              <>{assignmentStatusChip(row.assignmentStatus, jobStatusList)}</>
            )}
          </>
        )
      },
    },
    {
      flex: 0.2212,
      field: 'date',
      headerName: 'Date & Time',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Date & Time
        </Typography>
      ),
      renderCell: ({ row }: ProAssignJobCellType) => {
        return (
          <Typography>
            {convertTimeToTimezone(
              row.assignmentStatusUpdatedAt,
              auth.getValue().user?.timezone,
              timezoneList,
            )}
          </Typography>
        )
      },
    },
    {
      flex: 0.1659,
      field: 'message',
      headerName: 'Message',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Message
        </Typography>
      ),
      renderCell: ({ row }: ProAssignJobCellType) => {
        return (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {row.assignmentStatus === null ? null : (
              <IconButton
                sx={{ padding: 0 }}
                disabled
                onClick={() => onClickMessage(row)}
              >
                <Icon icon='mdi:message-text' />
              </IconButton>
            )}
          </Box>
        )
      },
    },

    {
      flex: 0.0876,
      field: 'action',

      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <></>,
      renderCell: ({ row }: ProAssignJobCellType) => {
        console.log(row, 'column-row')

        return (
          <>
            {requestType === 'bulkManualAssign' ? (
              row.assignmentStatus === 70100 ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    onClickAssign(selectedUser, requestType)
                    handleDetailClose()
                  }}
                >
                  Assign
                </Button>
              ) : requestCompleted ? null : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <IconButton
                    sx={{ width: '24px', height: '24px', padding: 0 }}
                    // onClick={handleClick}
                    onClick={e =>
                      handleDetailClick(e, {
                        userId: row.userId,
                        firstName: row.firstName,
                        middleName: row.middleName,
                        lastName: row.lastName,
                        assignmentStatus: row.assignmentStatus,
                      })
                    }
                  >
                    <Icon icon='mdi:dots-horizontal' />
                  </IconButton>
                  <Menu
                    elevation={8}
                    anchorEl={detailAnchorEl}
                    id='customized-menu'
                    onClose={handleDetailClose}
                    open={Boolean(detailAnchorEl)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    {requestCompleted ? null : (
                      <MenuItem
                        sx={{
                          gap: 2,
                          '&:hover': {
                            background: 'inherit',
                            cursor: 'default',
                          },
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          padding: 0,
                        }}
                      >
                        <Button
                          fullWidth
                          onClick={() => {
                            console.log(row, 'column-row12')

                            onClickAssign(selectedUser, requestType)
                            handleDetailClose()
                          }}
                          sx={{
                            justifyContent: 'flex-start',
                            padding: '6px 16px',
                            fontSize: 16,
                            fontWeight: 400,
                            color: 'rgba(76, 78, 100, 0.87)',
                            borderRadius: 0,
                          }}
                        >
                          Assign
                        </Button>
                      </MenuItem>
                    )}

                    {row.assignmentStatus === 70000 ||
                    row.assignmentStatus === null ||
                    !requestCompleted ? (
                      <MenuItem
                        sx={{
                          gap: 2,
                          '&:hover': {
                            background: 'inherit',
                            cursor: 'default',
                          },
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          padding: 0,
                        }}
                      >
                        <Button
                          sx={{
                            justifyContent: 'flex-start',
                            padding: '6px 16px',
                            color: '#FF4D49',
                            fontSize: 16,
                            fontWeight: 400,
                            borderRadius: 0,
                          }}
                          onClick={() => {
                            onClickCancel(selectedUser)
                            handleDetailClose()
                          }}
                          // onClick={onClickDeleteButton}
                        >
                          Cancel
                        </Button>
                      </MenuItem>
                    ) : null}
                    {row.assignmentStatus === 70300 ? (
                      <MenuItem
                        sx={{
                          gap: 2,
                          '&:hover': {
                            background: 'inherit',
                            cursor: 'default',
                          },
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          padding: 0,
                        }}
                      >
                        <Button
                          fullWidth
                          onClick={() => {
                            onClickReAssign(selectedUser)
                            handleDetailClose()
                          }}
                          sx={{
                            justifyContent: 'flex-start',
                            padding: '6px 16px',
                            fontSize: 16,
                            fontWeight: 400,
                            color: 'rgba(76, 78, 100, 0.87)',
                            borderRadius: 0,
                          }}
                        >
                          Re-assign
                        </Button>
                      </MenuItem>
                    ) : null}
                  </Menu>
                </Box>
              )
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <IconButton
                  sx={{ width: '24px', height: '24px', padding: 0 }}
                  // onClick={handleClick}
                  onClick={e =>
                    handleDetailClick(e, {
                      userId: row.userId,
                      firstName: row.firstName,
                      middleName: row.middleName,
                      lastName: row.lastName,
                      assignmentStatus: row.assignmentStatus,
                    })
                  }
                >
                  <Icon icon='mdi:dots-horizontal' />
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={detailAnchorEl}
                  id='customized-menu'
                  onClose={handleDetailClose}
                  open={Boolean(detailAnchorEl)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {requestCompleted ? null : (
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        fullWidth
                        onClick={() => {
                          onClickAssign(selectedUser, requestType)
                          handleDetailClose()
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          fontSize: 16,
                          fontWeight: 400,
                          color: 'rgba(76, 78, 100, 0.87)',
                          borderRadius: 0,
                        }}
                      >
                        Assign
                      </Button>
                    </MenuItem>
                  )}

                  {row.assignmentStatus === 70000 ||
                  row.assignmentStatus === null ||
                  !requestCompleted ? (
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          color: '#FF4D49',
                          fontSize: 16,
                          fontWeight: 400,
                          borderRadius: 0,
                        }}
                        onClick={() => {
                          onClickCancel(selectedUser)
                          handleDetailClose()
                        }}
                        // onClick={onClickDeleteButton}
                      >
                        Cancel
                      </Button>
                    </MenuItem>
                  ) : null}
                  {row.assignmentStatus === 70300 ? (
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        fullWidth
                        onClick={() => {
                          onClickReAssign(selectedUser)
                          handleDetailClose()
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          fontSize: 16,
                          fontWeight: 400,
                          color: 'rgba(76, 78, 100, 0.87)',
                          borderRadius: 0,
                        }}
                      >
                        Re-assign
                      </Button>
                    </MenuItem>
                  ) : null}
                </Menu>
              </Box>
            )}
          </>
        )
      },
    },
  ]

  return columns
}
