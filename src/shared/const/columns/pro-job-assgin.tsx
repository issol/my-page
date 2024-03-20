import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  Typography,
} from '@mui/material'
import {
  GridColumns,
  GridInputSelectionModel,
  GridRowId,
  GridSelectionModel,
} from '@mui/x-data-grid'
import {
  ProStatusChip,
  assignmentStatusChip,
} from '@src/@core/components/chips/chips'
import { ClientUserType, UserDataType } from '@src/context/types'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { JobRequestsProType } from '@src/types/jobs/jobs.type'
import { ProListCellType, ProListType } from '@src/types/pro/list'
import { TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction } from 'react'
import { Loadable } from 'recoil'

type CellType = {
  row: ProListType
}

type ProAssignJobCellType = {
  row: JobRequestsProType
}

export const getProJobAssignColumns = (
  isPrioritized: boolean,
  searchPro: boolean,
  requestPro: boolean,
  assignPro: boolean,
  selectedValue?: GridSelectionModel,
  setSelectedValue?: Dispatch<
    SetStateAction<{ [key: string]: GridSelectionModel }>
  >,
  label?: string,
  setSelectedRows?: Dispatch<
    SetStateAction<{
      [key: string]: {
        data: ProListType[]
        isPrivate?: boolean | undefined
        isPrioritized?: boolean | undefined
      }
    }>
  >,
  proList?: ProListType[],
) => {
  const columns: GridColumns<ProListType> = [
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
              const selectedPros =
                proList?.filter(pro => pro.userId === row.userId) ?? []
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
            {row.order}
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
      flex: 0.1321,
      field: 'avg',
      hideSortIcons: true,
      sortable: false,
      disableColumnMenu: true,
      hide: !searchPro,
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
      flex: searchPro ? 0.1635 : requestPro ? 0.2782 : 0.2453,
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
        return <Typography> {row.ongoingJobCount} job(s)</Typography>
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
  handleDetailClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  handleDetailClose: () => void,
  onClickAssign: (
    row: JobRequestsProType,
    requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  ) => void,
  onClickCancel: (row: JobRequestsProType) => void,
  onClickReAssign: (row: JobRequestsProType) => void,
  onClickMessage: (row: JobRequestsProType) => void,
  requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  jobStatusList: {
    value: number
    label: string
  }[],
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
        return (
          <>
            {requestType === 'bulkManualAssign' ? (
              row.assignmentStatus === 70100 ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    onClickAssign(row, requestType)
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
                    onClick={handleDetailClick}
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
                            onClickAssign(row, requestType)
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
                            onClickCancel(row)
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
                            onClickReAssign(row)
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
                  onClick={handleDetailClick}
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
                          onClickAssign(row, requestType)
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
                          onClickCancel(row)
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
                          onClickReAssign(row)
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
