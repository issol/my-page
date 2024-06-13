import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomPagination from 'src/pages/[companyName]/components/custom-pagination'

import FormControlLabel from '@mui/material/FormControlLabel'
import { AppliedRoleType } from '@src/types/onboarding/details'
import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import { currentRoleSelector, timezoneSelector } from '@src/states/permission'
import { Dispatch, MouseEvent, SetStateAction, useMemo, useState } from 'react'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import JobTypeRole from '../job-type-role-chips'
import JobTypeRoleChips from '../job-type-role-chips/role-chip'
import Icon from '@src/@core/components/icon'
import { Menu, MenuItem } from '@mui/material'
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { authState } from '@src/states/auth'

interface AppliedRoleProps {
  userInfo: Array<AppliedRoleType>
  hideFailedTest: boolean
  handleHideFailedTestChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  seeOnlyCertRoles?: boolean
  handleOnlyCertRolesChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  showTestInfo?: boolean
  handleShowTestInfoChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  selectedJobInfo: AppliedRoleType | null
  handleClickRoleCard: (jobInfo: AppliedRoleType) => void
  page: number
  totalCount: number
  rowsPerPage: number
  offset: number
  handleChangePage: (direction: string) => void
  onClickCertify: (jobInfo: AppliedRoleType) => void
  onClickResumeTest: (jobInfo: AppliedRoleType) => void
  onClickTestAssign: (jobInfo: AppliedRoleType, status?: string) => void
  onClickAddRole: () => void
  onClickRejectOrPause: (jobInfo: AppliedRoleType, type: string) => void
  onClickReason: (type: string, message: string, reason: string) => void
  type: string
  status?: string
}

const AppliedRole = ({
  userInfo,
  handleHideFailedTestChange,
  hideFailedTest,
  handleOnlyCertRolesChange,
  showTestInfo,
  handleShowTestInfoChange,
  seeOnlyCertRoles,
  selectedJobInfo,
  handleClickRoleCard,
  page,
  offset,
  rowsPerPage,
  handleChangePage,
  onClickCertify,
  onClickTestAssign,
  onClickResumeTest,
  onClickAddRole,
  onClickRejectOrPause,
  onClickReason,
  type,
  totalCount,
  status,
}: AppliedRoleProps) => {
  const [currentRole] = useRecoilStateLoadable(currentRoleSelector)
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const [anchorEl, setAnchorEl] = useState<{
    [key: number | string]: HTMLButtonElement | null
  }>({})
  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    roleId: number | string,
  ) => {
    event.stopPropagation()
    setAnchorEl(prev => ({
      ...prev,
      [roleId]: event.currentTarget,
    }))
  }

  const handleClose = (roleId: number | string) => {
    setAnchorEl(prev => ({ ...prev, [roleId]: null }))
  }

  const isDisabled = () => {
    if (type === 'onboarding') return false
    if (currentRole.contents.name === 'LPM') return true
    if (!status) return true
    const activeList = ['Onboard', 'Netflix Onboard']
    return !activeList.includes(status)
  }

  const getStatusButton = (jobInfo: AppliedRoleType) => {
    const basicTest = jobInfo.test.find(value => value.testType === 'basic')
    const skillTest = jobInfo.test.find(value => value.testType === 'skill')

    if (jobInfo.requestStatus === 'Awaiting assignment') {
      if (
        jobInfo.role === 'DTPer' ||
        jobInfo.role === 'DTP QCer' ||
        jobInfo.jobType === 'Interpretation'
      ) {
        return (
          <>
            <Box
              sx={{
                width: 270,
                height: 32,
                display: 'flex',
                gap: '16px',
              }}
            >
              <Button
                variant='outlined'
                fullWidth
                sx={{
                  border: '1px solid rgba(255, 77, 73, 0.5)',
                  color: '#FF4D49',
                }}
                onClick={() => {
                  onClickRejectOrPause(jobInfo, 'reject')
                }}
                disabled={isDisabled()}
              >
                Reject
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  onClickCertify(jobInfo)
                }}
                disabled={isDisabled()}
              >
                Certify
              </Button>
            </Box>
          </>
        )
      } else if (
        // no test case 1, jobInfo.requestStatus가 Awaiting assignment일 경우
        basicTest &&
        skillTest &&
        // ((basicTest!.status === 'No test' && skillTest!.status === 'No test') ||
        //   (basicTest!.status !== 'No test' && skillTest!.status === 'No test'))
        skillTest!.status === 'No test'
      ) {
        if (
          jobInfo.role === 'DTPer' ||
          jobInfo.role === 'DTP QCer' ||
          jobInfo.jobType === 'Interpretation'
        ) {
          return (
            <>
              <Box
                sx={{
                  width: 270,
                  height: 32,
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Button
                  variant='outlined'
                  fullWidth
                  sx={{
                    border: '1px solid rgba(255, 77, 73, 0.5)',
                    color: '#FF4D49',
                  }}
                  onClick={() => {
                    onClickRejectOrPause(jobInfo, 'reject')
                  }}
                  disabled={isDisabled()}
                >
                  Reject
                </Button>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => {
                    onClickCertify(jobInfo)
                  }}
                  disabled={isDisabled()}
                >
                  Certify
                </Button>
              </Box>
            </>
          )
        } else {
          return (
            <Box
              sx={{
                width: 270,
                height: 32,
                display: 'flex',
              }}
            >
              <Button
                fullWidth
                variant='contained'
                disabled
                sx={{
                  '&.Mui-disabled': {
                    background:
                      'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
                    border: 'none',
                    color: '#E04440',
                  },
                }}
              >
                No certification test created
              </Button>
            </Box>
          )
        }
      } else {
        return (
          <>
            <Box
              sx={{
                width: 270,
                height: 32,
                display: 'flex',
                gap: '16px',
              }}
            >
              <Button
                variant='outlined'
                fullWidth
                sx={{
                  border: '1px solid rgba(255, 77, 73, 0.5)',
                  color: '#FF4D49',
                }}
                onClick={() => {
                  onClickRejectOrPause(jobInfo, 'reject')
                }}
                disabled={isDisabled()}
              >
                Reject
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  onClickTestAssign(jobInfo)
                  // basicTest!.status === 'No test'
                  //   ? onClickTestAssign(jobInfo, 'Skill in progress')
                  //   : onClickTestAssign(jobInfo)
                }}
                sx={{
                  '&.Mui-disabled': {
                    background: '#fff',
                    color: ' rgba(76, 78, 100, 0.38)',
                    border: '1px solid #4C4E641F',
                  },
                }}
                disabled={isDisabled()}
              >
                Assign test
              </Button>
            </Box>
          </>
        )
      }
    } else if (
      jobInfo.requestStatus === 'Awaiting response' &&
      ((skillTest && skillTest.status !== 'No test') ||
        jobInfo.test.length === 0)
    ) {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background: 'rgba(76, 78, 100, 0.12)',
                border: 'none',
                color: 'rgba(76, 78, 100, 0.38)',
              },
            }}
          >
            {jobInfo.requestStatusOfPro} - Awaiting response
          </Button>
        </Box>
      )
    } else if (
      // requestStatus가 Certified인데 testStatus가 Cancelled로 남아있는 디비 정보가 있어 예외처리함
      // 2024.01.09 예외처리 제거
      jobInfo.testStatus === 'Skill failed' &&
      jobInfo.requestStatus !== 'Certified'
    ) {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
                border: 'none',
                color: '#E04440',
              },
            }}
          >
            Failed
          </Button>
        </Box>
      )
    } else if (
      jobInfo!.requestStatus === 'Test assigned' &&
      jobInfo.testStatus === 'Awaiting assignment' &&
      skillTest &&
      skillTest.status !== 'No test'
    ) {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128;',
                border: 'none',
                color: '#64C623',
              },
            }}
          >
            Test assigned
          </Button>
        </Box>
      )
    } else if (
      basicTest &&
      // (jobInfo!.requestStatus === 'Test in progress' ||
      //   jobInfo!.requestStatus === 'Basic in progress') &&
      (jobInfo!.testStatus === 'Basic in progress' ||
        jobInfo!.testStatus === 'Basic submitted' ||
        jobInfo!.testStatus === 'Basic failed' ||
        jobInfo!.testStatus === 'Basic passed')
    ) {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528',
                border: 'none',
                color: '#DF9F23',
              },
            }}
          >
            Basic test in progress
          </Button>
        </Box>
      )
    } else if (
      skillTest &&
      // jobInfo!.requestStatus === 'Test in progress' &&
      (jobInfo!.testStatus === 'Skill in progress' ||
        jobInfo!.testStatus === 'Skill submitted' ||
        jobInfo!.testStatus === 'Reviewing' ||
        jobInfo!.testStatus === 'Review completed' ||
        jobInfo!.testStatus === 'Review canceled')
    ) {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF',
                border: 'none',
                color: '#666CFF',
              },
            }}
          >
            Skill test in progress
          </Button>
        </Box>
      )
    } else if (
      (jobInfo!.requestStatus === 'Test in progress' &&
        jobInfo!.testStatus === 'Skipped') ||
      (jobInfo!.requestStatus === 'Test in progress' &&
        basicTest &&
        basicTest.status === 'No test' &&
        skillTest &&
        skillTest.status === 'Awaiting assignment')
    ) {
      // basic skip
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128',
                border: 'none',
                color: '#64C623',
              },
            }}
          >
            Test assigned
          </Button>
        </Box>
      )
    } else if (
      // no test case 2, jobInfo.requestStatus에 상관없이 체크
      basicTest &&
      skillTest &&
      // ((basicTest!.status === 'No test' && skillTest!.status === 'No test') ||
      //   (basicTest!.status !== 'No test' && skillTest!.status === 'No test'))
      skillTest!.status === 'No test'
    ) {
      if (
        jobInfo.role === 'DTPer' ||
        jobInfo.role === 'DTP QCer' ||
        jobInfo.jobType === 'Interpretation'
      ) {
        return (
          <>
            <Box
              sx={{
                width: 270,
                height: 32,
                display: 'flex',
                gap: '16px',
              }}
            >
              <Button
                variant='outlined'
                fullWidth
                sx={{
                  border: '1px solid rgba(255, 77, 73, 0.5)',
                  color: '#FF4D49',
                }}
                onClick={() => {
                  onClickRejectOrPause(jobInfo, 'reject')
                }}
                disabled={isDisabled()}
              >
                Reject
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  onClickCertify(jobInfo)
                }}
                disabled={isDisabled()}
              >
                Certify
              </Button>
            </Box>
          </>
        )
      } else {
        return (
          <Box
            sx={{
              width: 270,
              height: 32,
              display: 'flex',
            }}
          >
            <Button
              fullWidth
              variant='contained'
              disabled
              sx={{
                '&.Mui-disabled': {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
                  border: 'none',
                  color: '#E04440',
                },
              }}
            >
              No certification test created
            </Button>
          </Box>
        )
      }
    } else if (jobInfo.requestStatus === 'Test rejected') {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
                border: 'none',
                color: '#E04440',
              },
            }}
          >
            Rejected
          </Button>
        </Box>
      )
    } else if (jobInfo.requestStatus === 'Paused') {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            sx={{
              '&.Mui-disabled': {
                background: 'rgba(76, 78, 100, 0.12)',
                border: 'none',
                color: 'rgba(76, 78, 100, 0.38)',
              },
            }}
            disabled={isDisabled()}
          >
            Paused
          </Button>
        </Box>
      )
    } else if (jobInfo.requestStatus === 'Certified') {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            sx={{
              display: 'flex',
              gap: '8px',
              cursor: 'unset',
              width: '100%',
              justifyContent: 'flex-start',
              paddingLeft: 0,
            }}
            disabled
          >
            <img
              src='/images/icons/onboarding-icons/certified-role.svg'
              alt='certified'
            />
            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
              Certified
            </Typography>
          </Button>
        </Box>
      )
    } else {
      return (
        <Box
          sx={{
            width: 270,
            height: 32,
            display: 'flex',
          }}
        >
          <Button
            fullWidth
            variant='contained'
            sx={{
              '&.Mui-disabled': {
                background: 'rgba(76, 78, 100, 0.12)',
                border: 'none',
                color: 'rgba(76, 78, 100, 0.38)',
              },
            }}
            disabled={true}
          >
            -
          </Button>
        </Box>
      )
    }
  }

  const getPauseResumeButton = (jobInfo: AppliedRoleType) => {
    let usePauseButton = false
    let useResumeButton = false
    let useReasonIcon = false

    if (
      !(
        (jobInfo.test.find(data => data.testType === 'basic')?.status ===
          'No test' &&
          jobInfo.test.find(data => data.testType === 'skill')?.status ===
            'No test') ||
        (jobInfo.test.find(data => data.testType === 'basic')?.status !==
          'No test' &&
          jobInfo.test.find(data => data.testType === 'skill')?.status ===
            'No test')
      ) &&
      jobInfo.requestStatus !== 'Certified' &&
      jobInfo.requestStatus !== 'Awaiting assignment' &&
      jobInfo.requestStatus !== 'Paused' &&
      jobInfo.requestStatus !== 'Test rejected' &&
      !(
        jobInfo.test.find(data => data.testType === 'basic')?.status ===
          'Basic failed' &&
        jobInfo.test.find(data => data.testType === 'skill')?.status ===
          'Awaiting assignment'
      ) &&
      jobInfo.test.find(data => data.testType === 'skill')?.status !==
        'Skill failed' &&
      jobInfo.test.find(data => data.testType === 'skill')?.status !==
        'Cancelled'
    ) {
      usePauseButton = true
    } else if (jobInfo.requestStatus === 'Paused') {
      useResumeButton = true
    } else if (jobInfo.requestStatus === 'Test rejected') {
      useResumeButton = true
    }

    return (
      <Box>
        {usePauseButton || useResumeButton ? (
          <Box>
            <IconButton
              sx={{ width: '24px', height: '24px', padding: 0 }}
              onClick={e => {
                handleClick(e, jobInfo.id)
              }}
            >
              <Icon icon='mdi:dots-vertical' />
            </IconButton>
            <Menu
              elevation={8}
              anchorEl={anchorEl[jobInfo.id]}
              id={`pause-menu-${jobInfo.id}`}
              onClose={() => handleClose(jobInfo.id)}
              open={Boolean(anchorEl[jobInfo.id])}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {usePauseButton ? (
                <MenuItem
                  sx={{
                    gap: 2,
                    '&:hover': {
                      background: 'inherit',
                      cursor: 'default',
                    },
                  }}
                  disabled={isDisabled()}
                  onClick={() => {
                    onClickRejectOrPause(jobInfo, 'pause')
                  }}
                >
                  Pause
                </MenuItem>
              ) : null}
              {useResumeButton ? (
                <MenuItem
                  sx={{
                    gap: 2,
                    '&:hover': {
                      background: 'inherit',
                      cursor: 'default',
                    },
                  }}
                  onClick={() => {
                    onClickResumeTest(jobInfo)
                  }}
                  disabled={isDisabled()}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    Resume
                    {useReasonIcon ? (
                      <Box
                        sx={{
                          width: '20px',
                          height: '20px',
                        }}
                      >
                        <IconButton
                          sx={{ padding: 0 }}
                          onClick={event => {
                            event.stopPropagation()
                            onClickReason(
                              jobInfo.requestStatus,
                              jobInfo.messageToUser!,
                              jobInfo.reason!,
                            )
                          }}
                        >
                          <img
                            src='/images/icons/onboarding-icons/more-reason.svg'
                            alt='more'
                          ></img>
                        </IconButton>
                      </Box>
                    ) : null}
                  </Box>
                </MenuItem>
              ) : null}
            </Menu>
          </Box>
        ) : null}
      </Box>
    )
  }

  const SectionTitle = useMemo(() => {
    // if (type === 'onboarding') return 'Applied Role'
    // if (currentRole.contents.name === 'LPM')
    //   return 'Certified role and test information'
    // return "Pro's role and Applied"
    return 'Certified role and test information'
  }, [type])

  const columns: GridColDef[] = [
    {
      field: 'jobType',
      headerName: 'Job Type',
      minWidth: 165,
      flex: 0.1469,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderCell: ({ row }: { row: AppliedRoleType }) => {
        return (
          <JobTypeRoleChips
            jobType={row.jobType}
            role={row.role}
            visibleChip={'jobType'}
          />
        )
      },
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 219,
      flex: 0.195,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderCell: ({ row }: { row: AppliedRoleType }) => {
        return (
          <JobTypeRoleChips
            jobType={row.jobType}
            role={row.role}
            visibleChip={'role'}
          />
        )
      },
    },
    {
      field: 'languagePair',
      headerName: 'Language Pair',
      minWidth: 156,
      flex: 0.1389,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderCell: ({ row }: { row: AppliedRoleType }) => {
        return (
          <Typography
            variant='subtitle1'
            sx={{
              fontWeight: 600,
              lineHeight: '24px',
            }}
          >
            {row.source?.toUpperCase()} &rarr; {row.target?.toUpperCase()}
          </Typography>
        )
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 306,
      flex: 0.2725,
      cellClassName: 'action-cell',
      renderCell: ({ row }: { row: AppliedRoleType }) => {
        return <Box>{getStatusButton(row)}</Box>
      },
    },
    {
      field: 'appliedDate',
      headerName: 'Applied Date',
      minWidth: 230,
      flex: 0.2048,
      renderCell: ({ row }: { row: AppliedRoleType }) => {
        return (
          <Typography fontSize={14} fontWeight={400}>
            {convertTimeToTimezone(
              row.createdAt,
              auth.getValue().user?.timezone,
              timezone.getValue(),
            )}
          </Typography>
        )
      },
    },
    {
      field: 'actionResume',
      headerName: '',
      minWidth: 47,
      flex: 0.0419,
      renderCell: ({ row }: { row: AppliedRoleType }) => {
        return <Box>{getPauseResumeButton(row)}</Box>
      },
    },
  ]

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 20px 0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {SectionTitle}
          <IconButton
            sx={{
              padding: 0,
            }}
            onClick={onClickAddRole}
          >
            <img src='/images/icons/onboarding-icons/add-role.svg' alt='add' />
          </IconButton>
        </Box>
        <Box>
          {type !== 'onboarding' && currentRole.contents.name === 'TAD' ? (
            <FormControlLabel
              value='seeOnlyCertRoles'
              control={
                <Switch
                  checked={seeOnlyCertRoles}
                  onChange={handleOnlyCertRolesChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '0.15px',
                    color: 'rgba(76, 78, 100, 0.6)',
                  }}
                >
                  See only certified roles
                </Typography>
              }
              labelPlacement='start'
            />
          ) : null}
          {currentRole.contents.name === 'TAD' && totalCount ? (
            <FormControlLabel
              value='hideFailedTest'
              control={
                <Switch
                  checked={hideFailedTest}
                  onChange={handleHideFailedTestChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '0.15px',
                    color: 'rgba(76, 78, 100, 0.6)',
                  }}
                >
                  Hide inactive tests
                </Typography>
              }
              labelPlacement='start'
            />
          ) : null}
          {type !== 'onboarding' && currentRole.contents.name === 'LPM' ? (
            <FormControlLabel
              value='hideFailedTest'
              control={
                <Switch
                  checked={showTestInfo}
                  onChange={handleShowTestInfoChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '0.15px',
                    color: 'rgba(76, 78, 100, 0.6)',
                  }}
                >
                  Show test info
                </Typography>
              }
              labelPlacement='start'
            />
          ) : null}
        </Box>
      </Typography>
      {userInfo && userInfo.length ? (
        <Card>
          <Box
            sx={{
              // minHeight: 356,
              height: 356,
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'none',
              },
              // '& .MuiDataGrid-footerContainer': {
              //   display: 'none',
              // },
              '& .selected': {
                background: 'rgba(76, 78, 100, 0.12)',
              },
              '& .action-cell': {
                padding: '10px 16px 10px 20px !important',
              },
            }}
          >
            <DataGridPro
              rows={userInfo}
              columns={columns}
              hideFooter
              disableRowSelectionOnClick
              onRowClick={e => handleClickRoleCard(e.row as AppliedRoleType)}
              getRowClassName={params => {
                return params.row.id === selectedJobInfo?.id ? 'selected' : ''
              }}
            />
            {/* <DataGrid
              rows={userInfo}
              columns={columns}
              disableSelectionOnClick
              onRowClick={e => handleClickRoleCard(e.row as AppliedRoleType)}
              getRowClassName={params => {
                return params.row.id === selectedJobInfo?.id ? 'selected' : ''
              }}
            /> */}
          </Box>
        </Card>
      ) : null}
    </Card>
  )
}

export default AppliedRole
