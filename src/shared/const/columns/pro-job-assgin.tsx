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
  Badge,
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
import {
  AssignProFilterPostType,
  AssignProListType,
  ProListForJobBySortEnum,
} from '@src/types/orders/job-detail'
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
  jobStatusList: {
    value: number
    label: string
  }[],
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
  activeFilter?: AssignProFilterPostType,
  setActiveFilter?: Dispatch<SetStateAction<AssignProFilterPostType>>,
  headerHover?: { [key: string]: boolean },
  setHeaderHover?: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
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
        // <IconButton>
        //   <Icon
        //     icon='mdi:arrow-up'
        //     color='rgba(76, 78, 100, 0.54)'
        //     fontSize={20}
        //   />
        // </IconButton>

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
      sortable: false,
      renderHeader: () => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '4px',
          }}
          onMouseEnter={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['LegalName']: true }))
          }
          onMouseLeave={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['LegalName']: false }))
          }
        >
          <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
            Legal name / Email
          </Typography>
          {headerHover && headerHover['LegalName'] ? (
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setActiveFilter &&
                  activeFilter &&
                  setActiveFilter({
                    ...activeFilter,
                    sort: ProListForJobBySortEnum.LEGAL_NAME,
                    ordering: activeFilter.ordering === 'ASC' ? 'DESC' : 'ASC',
                  })
              }}
            >
              <Icon
                icon={
                  activeFilter &&
                  activeFilter.sort === undefined &&
                  activeFilter.ordering === undefined
                    ? 'mdi:arrow-up'
                    : activeFilter &&
                        activeFilter.sort === ProListForJobBySortEnum.LEGAL_NAME
                      ? activeFilter && activeFilter.ordering === 'ASC'
                        ? 'mdi:arrow-up'
                        : 'mdi:arrow-down'
                      : 'mdi:arrow-up'
                }
                color='rgba(76, 78, 100, 0.54)'
                fontSize={20}
              />
            </IconButton>
          ) : null}
        </Box>
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
              <Tooltip
                title={
                  jobStatusList.find(value => value.value === row.responseLight)
                    ?.label ?? '-'
                }
              >
                <Image
                  src={`/images/icons/job-icons/status-${(row as AssignProListType).responseLight === 70100 ? 'green' : (row as AssignProListType).responseLight === 70000 || (row as AssignProListType).responseLight === 70500 || (row as AssignProListType).responseLight === 70600 ? 'orange' : (row as AssignProListType).responseLight === 70200 || ((row as AssignProListType).responseLight === 70400 && 'red')}.svg`}
                  alt=''
                  width={8}
                  height={8}
                />
              </Tooltip>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '4px',
          }}
          onMouseEnter={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['Status']: true }))
          }
          onMouseLeave={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['Status']: false }))
          }
        >
          <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
            Status
          </Typography>
          {headerHover && headerHover['Status'] ? (
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setActiveFilter &&
                  activeFilter &&
                  setActiveFilter({
                    ...activeFilter,
                    sort: ProListForJobBySortEnum.STATUS,
                    ordering: activeFilter.ordering === 'ASC' ? 'DESC' : 'ASC',
                  })
              }}
            >
              <Icon
                icon={
                  activeFilter &&
                  activeFilter.sort === undefined &&
                  activeFilter.ordering === undefined
                    ? 'mdi:arrow-up'
                    : activeFilter &&
                        activeFilter.sort === ProListForJobBySortEnum.STATUS
                      ? activeFilter && activeFilter.ordering === 'ASC'
                        ? 'mdi:arrow-up'
                        : 'mdi:arrow-down'
                      : 'mdi:arrow-up'
                }
                color='rgba(76, 78, 100, 0.54)'
                fontSize={20}
              />
            </IconButton>
          ) : null}
        </Box>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '4px',
          }}
          onMouseEnter={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['AvgResponse']: true }))
          }
          onMouseLeave={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['AvgResponse']: false }))
          }
        >
          <Tooltip title='Avg. response time'>
            <Typography
              variant='subtitle1'
              fontWeight={500}
              fontSize={14}
              sx={{
                maxWidth: '72%',
                height: 'auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Avg. response time
            </Typography>
          </Tooltip>

          {headerHover && headerHover['AvgResponse'] ? (
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setActiveFilter &&
                  activeFilter &&
                  setActiveFilter({
                    ...activeFilter,
                    sort: ProListForJobBySortEnum.AVG_RESPONSE,
                    ordering: activeFilter.ordering === 'ASC' ? 'DESC' : 'ASC',
                  })
              }}
            >
              <Icon
                icon={
                  activeFilter &&
                  activeFilter.sort === undefined &&
                  activeFilter.ordering === undefined
                    ? 'mdi:arrow-up'
                    : activeFilter &&
                        activeFilter.sort ===
                          ProListForJobBySortEnum.AVG_RESPONSE
                      ? activeFilter && activeFilter.ordering === 'ASC'
                        ? 'mdi:arrow-up'
                        : 'mdi:arrow-down'
                      : 'mdi:arrow-up'
                }
                color='rgba(76, 78, 100, 0.54)'
                fontSize={20}
              />
            </IconButton>
          ) : null}
        </Box>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '4px',
          }}
          onMouseEnter={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['OngoingJobs']: true }))
          }
          onMouseLeave={() =>
            setHeaderHover &&
            setHeaderHover(prev => ({ ...prev, ['OngoingJobs']: false }))
          }
        >
          <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
            Ongoing jobs
          </Typography>
          {headerHover && headerHover['OngoingJobs'] ? (
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setActiveFilter &&
                  activeFilter &&
                  setActiveFilter({
                    ...activeFilter,
                    sort: ProListForJobBySortEnum.ONGOING_JOBS,
                    ordering: activeFilter.ordering === 'ASC' ? 'DESC' : 'ASC',
                  })
              }}
            >
              <Icon
                icon={
                  activeFilter &&
                  activeFilter.sort === undefined &&
                  activeFilter.ordering === undefined
                    ? 'mdi:arrow-up'
                    : activeFilter &&
                        activeFilter.sort ===
                          ProListForJobBySortEnum.ONGOING_JOBS
                      ? activeFilter && activeFilter.ordering === 'ASC'
                        ? 'mdi:arrow-up'
                        : 'mdi:arrow-down'
                      : 'mdi:arrow-up'
                }
                color='rgba(76, 78, 100, 0.54)'
                fontSize={20}
              />
            </IconButton>
          ) : null}
        </Box>
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
  isAssigned: boolean,
  detailAnchorEls: {
    [key: number]: HTMLButtonElement | null
  },
  handleDetailClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
      jobReqId: number | null
    },
  ) => void,
  handleDetailClose: (userId: number) => void,
  onClickAssign: (
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
      jobReqId: number | null
    },
    requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  ) => void,
  onClickCancel: (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => void,
  onClickReAssign: (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => void,
  onClickMessage: (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => void,
  requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  jobStatusList: {
    value: number
    label: string
  }[],
  selectedUser: {
    [key: number]: {
      userId: number
      firstName: string
      middleName?: string | null | undefined
      lastName: string
      assignmentStatus: number
      jobReqId: number | null
    } | null
  },
  selectedJobUpdatable: boolean
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
              <>
                {assignmentStatusChip(
                  row.assignmentStatus === 70150
                    ? 70100
                    : row.assignmentStatus === 70450
                      ? 70400
                      : row.assignmentStatus,
                  jobStatusList,
                )}
              </>
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
              <Box sx={{ margin: '0 auto' }}>
                <Badge badgeContent={row.message?.unReadCount} color='primary'>
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={e =>
                      onClickMessage({
                        userId: row.userId,
                        firstName: row.firstName,
                        middleName: row.middleName,
                        lastName: row.lastName,
                        assignmentStatus: row.assignmentStatus,
                        jobReqId: row.jobRequestId,
                      })
                    }
                  >
                    <Icon
                      icon='material-symbols:chat'
                      color='rgba(187, 188, 196, 1)'
                    />
                  </IconButton>
                </Badge>
              </Box>
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
            {selectedJobUpdatable ?
              isAssigned ? (
                [70300, 70350].includes(row.assignmentStatus) ? (
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
                          jobReqId: row.jobRequestId,
                        })
                      }
                    >
                      <Icon icon='mdi:dots-horizontal' />
                    </IconButton>
                    <Menu
                      elevation={8}
                      anchorEl={detailAnchorEls[row.userId]}
                      id={`customized-menu-${row.userId}`}
                      onClose={() => handleDetailClose(row.userId)}
                      open={Boolean(detailAnchorEls[row.userId])}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
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
                            onClickReAssign(selectedUser[row.userId]!)
                            handleDetailClose(row.userId)
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
                    </Menu>
                  </Box>
                ) : null
              ) : requestType === 'bulkManualAssign' &&
                row.assignmentStatus === 70100 ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    onClickAssign(
                      {
                        ...row,
                        jobReqId: row.jobRequestId,
                      },
                      requestType,
                    )
                    handleDetailClose(row.userId)
                  }}
                >
                  Assign
                </Button>
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
                        jobReqId: row.jobRequestId,
                      })
                    }
                  >
                    <Icon icon='mdi:dots-horizontal' />
                  </IconButton>
                  <Menu
                    elevation={8}
                    anchorEl={detailAnchorEls[row.userId]}
                    id={`customized-menu-${row.userId}`}
                    onClose={() => handleDetailClose(row.userId)}
                    open={Boolean(detailAnchorEls[row.userId])}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
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
                          onClickAssign(selectedUser[row.userId]!, requestType)
                          handleDetailClose(row.userId)
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
                    {((requestType === 'bulkManualAssign' ||
                      requestType === 'bulkAutoAssign') &&
                      row.assignmentStatus === 70000) ||
                    requestType === 'relayRequest' ? (
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
                            onClickCancel(selectedUser[row.userId]!)
                            handleDetailClose(row.userId)
                          }}
                          // onClick={onClickDeleteButton}
                        >
                          Cancel
                        </Button>
                      </MenuItem>
                    ) : null}
                  </Menu>
                </Box>
              ) : null}
            {/* {requestType === 'bulkManualAssign' ? (
              row.assignmentStatus === 70100 && !isAssigned ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    onClickAssign(
                      {
                        ...row,
                        jobReqId: row.jobRequestId,
                      },
                      requestType,
                    )
                    handleDetailClose()
                  }}
                >
                  Assign
                </Button>
              ) : isAssigned ? null : (
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
                        jobReqId: row.jobRequestId,
                      })
                    }
                  >
                    <Icon icon='mdi:dots-horizontal' />
                  </IconButton>
                  <Menu
                    elevation={8}
                    anchorEl={
                      detailAnchorEl.id === selectedUser?.userId
                        ? detailAnchorEl.el
                        : null
                    }
                    id='customized-menu'
                    onClose={handleDetailClose}
                    open={Boolean(
                      detailAnchorEl.id === selectedUser?.userId
                        ? detailAnchorEl.el
                        : null,
                    )}
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
                    !isAssigned ? (
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
                      jobReqId: row.jobRequestId,
                    })
                  }
                >
                  <Icon icon='mdi:dots-horizontal' />
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={
                    detailAnchorEl.id === selectedUser?.userId
                      ? detailAnchorEl.el
                      : null
                  }
                  id='customized-menu'
                  onClose={handleDetailClose}
                  open={Boolean(
                    detailAnchorEl.id === selectedUser?.userId
                      ? detailAnchorEl.el
                      : null,
                  )}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {isAssigned ? null : (
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
                  !isAssigned ? (
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
            )} */}
          </>
        )
      },
    },
  ]

  return columns
}
