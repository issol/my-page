import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomPagination from '@src/pages/components/custom-pagination'

import FormControlLabel from '@mui/material/FormControlLabel'
import { AppliedRoleType } from '@src/types/onboarding/details'
import { useRecoilStateLoadable } from 'recoil'
import { currentRoleSelector } from '@src/states/permission'
import { useMemo } from 'react'

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
            <Grid item md={4} lg={4} xs={4}>
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
            </Grid>
            <Grid item md={8} lg={8} xs={8}>
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
            </Grid>
          </>
        )
      } else if (
        // no test case 1, jobInfo.requestStatus가 Awaiting assignment일 경우
        basicTest &&
        skillTest &&
        ((basicTest!.status === 'NO_TEST' && skillTest!.status === 'NO_TEST') ||
          (basicTest!.status !== 'NO_TEST' && skillTest!.status === 'NO_TEST'))
      ) {
        if (
          jobInfo.role === 'DTPer' ||
          jobInfo.role === 'DTP QCer' ||
          jobInfo.jobType === 'Interpretation'
        ) {
          return (
            <>
              <Grid item md={4} lg={4} xs={4}>
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
              </Grid>
              <Grid item md={8} lg={8} xs={8}>
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
              </Grid>
            </>
          )
        } else {
          return (
            <Button
              fullWidth
              variant='contained'
              disabled
              sx={{
                '&.Mui-disabled': {
                  background: 'rgba(76, 78, 100, 0.12)',
                  border: 'none',
                  color: ' rgba(76, 78, 100, 0.38)',
                },
              }}
            >
              No certification test created
            </Button>
          )
        }
      } else {
        return (
          <>
            <Grid item md={4} lg={4} xs={4}>
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
            </Grid>
            <Grid item md={8} lg={8} xs={8}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  onClickTestAssign(jobInfo)
                  // basicTest!.status === 'NO_TEST'
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
            </Grid>
          </>
        )
      }
    } else if (jobInfo.requestStatus === 'Awaiting response') {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background: 'rgba(76, 78, 100, 0.12)',
              border: 'none',
              color: ' rgba(76, 78, 100, 0.38)',
            },
          }}
        >
          {jobInfo.requestStatusOfPro} - Awaiting response
        </Button>
      )
    } else if (
      // requestStatus가 Certified인데 testStatus가 Cancelled로 남아있는 디비 정보가 있어 예외처리함
      // 2024.01.09 예외처리 제거
      jobInfo.testStatus === 'Skill failed' &&
      jobInfo.requestStatus !== 'Certified'
    ) {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
              border: '1px solid rgba(255, 77, 73, 0.5)',
              color: '#E04440',
            },
          }}
        >
          Failed
        </Button>
      )
    } else if (
      jobInfo!.requestStatus === 'Test assigned' &&
      jobInfo.testStatus === 'Awaiting assignment' &&
      skillTest &&
      skillTest.status !== 'NO_TEST'
    ) {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128;',
              border: '1px solid rgba(114, 225, 40, 0.5)',
              color: '#64C623',
            },
          }}
        >
          Test assigned
        </Button>
      )
    } else if (
      basicTest &&
      (jobInfo!.requestStatus === 'Test in progress' ||
        jobInfo!.requestStatus === 'Basic in progress') &&
      (jobInfo!.testStatus === 'Basic in progress' ||
        jobInfo!.testStatus === 'Basic submitted' ||
        jobInfo!.testStatus === 'Basic failed' ||
        jobInfo!.testStatus === 'Basic passed')
    ) {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528',
              border: '1px solid rgba(253, 181, 40, 0.5)',
              color: '#DF9F23',
            },
          }}
        >
          Basic test in progress
        </Button>
      )
    } else if (
      skillTest &&
      jobInfo!.requestStatus === 'Test in progress' &&
      (jobInfo!.testStatus === 'Skill in progress' ||
        jobInfo!.testStatus === 'Skill submitted' ||
        jobInfo!.testStatus === 'Reviewing' ||
        jobInfo!.testStatus === 'Review completed' ||
        jobInfo!.testStatus === 'Review canceled')
    ) {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF',
              border: ' 1px solid #666CFF',
              color: '#666CFF',
            },
          }}
        >
          Skill test in progress
        </Button>
      )
    } else if (
      (jobInfo!.requestStatus === 'Test in progress' &&
        jobInfo!.testStatus === 'Skipped') ||
      (jobInfo!.requestStatus === 'Test in progress' &&
        basicTest &&
        basicTest.status === 'NO_TEST' &&
        skillTest &&
        skillTest.status === 'Awaiting assignment')
    ) {
      // basic skip
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128',
              border: '1px solid rgba(114, 225, 40, 0.5)',
              color: '#64C623',
            },
          }}
        >
          Test assigned
        </Button>
      )
    } else if (
      // no test case 2, jobInfo.requestStatus에 상관없이 체크
      basicTest &&
      skillTest &&
      ((basicTest!.status === 'NO_TEST' && skillTest!.status === 'NO_TEST') ||
        (basicTest!.status !== 'NO_TEST' && skillTest!.status === 'NO_TEST'))
    ) {
      if (
        jobInfo.role === 'DTPer' ||
        jobInfo.role === 'DTP QCer' ||
        jobInfo.jobType === 'Interpretation'
      ) {
        return (
          <>
            <Grid item md={4} lg={4} xs={4}>
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
            </Grid>
            <Grid item md={8} lg={8} xs={8}>
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
            </Grid>
          </>
        )
      } else {
        return (
          <Button
            fullWidth
            variant='contained'
            disabled
            sx={{
              '&.Mui-disabled': {
                background: 'rgba(76, 78, 100, 0.12)',
                border: 'none',
                color: ' rgba(76, 78, 100, 0.38)',
              },
            }}
          >
            No certification test created
          </Button>
        )
      }
    } else if (jobInfo.requestStatus === 'Test rejected') {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
              border: '1px solid rgba(255, 77, 73, 0.5)',
              color: '#E04440',
            },
          }}
        >
          Rejected
        </Button>
      )
    } else if (jobInfo.requestStatus === 'Paused') {
      return (
        <Button
          fullWidth
          variant='contained'
          sx={{
            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
              border: '1px solid rgba(255, 77, 73, 0.5)',
              color: '#E04440',
            },
          }}
          disabled={isDisabled()}
        >
          Paused
        </Button>
      )
    } else if (jobInfo.requestStatus === 'Certified') {
      return (
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
      )
    } else {
      return <Typography></Typography>
    }
  }

  const SectionTitle = useMemo(() => {
    if (type === 'onboarding') return 'Applied Role'
    if (currentRole.contents.name === 'LPM')
      return 'Certified role and test information'
    return "Pro's role and Applied"
  }, [type])

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
        <Box sx={{ minHeight: 22, paddingLeft: '20px' }}>
          <Grid container xs={12} spacing={5}>
            {userInfo && userInfo.length
              ? userInfo
                  .slice(offset, offset + rowsPerPage)
                  .map((value, index) => {
                    return (
                      <Grid
                        item
                        lg={6}
                        md={12}
                        sm={12}
                        xs={12}
                        key={`${value.id}-${index}`}
                      >
                        <Card
                          className='applied_card'
                          sx={{
                            padding: '20px',
                            height: '100%',
                            cursor: 'pointer',
                            boxShadow:
                              selectedJobInfo &&
                              value.id === selectedJobInfo!.id
                                ? 3
                                : 0,
                            border:
                              selectedJobInfo &&
                              value.id === selectedJobInfo!.id
                                ? '2px solid #666CFF'
                                : '2px solid rgba(76, 78, 100, 0.12)',
                          }}
                          onClick={() => handleClickRoleCard(value)}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box>
                              <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 600, lineHeight: '24px' }}
                              >
                                {value.jobType}
                              </Typography>
                              <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 600 }}
                              >
                                {value.role}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: 0,
                                gap: 2,
                              }}
                            >
                              {!(
                                (value.test.find(
                                  data => data.testType === 'basic',
                                )?.status === 'NO_TEST' &&
                                  value.test.find(
                                    data => data.testType === 'skill',
                                  )?.status === 'NO_TEST') ||
                                (value.test.find(
                                  data => data.testType === 'basic',
                                )?.status !== 'NO_TEST' &&
                                  value.test.find(
                                    data => data.testType === 'skill',
                                  )?.status === 'NO_TEST')
                              ) &&
                              value.requestStatus !== 'Certified' &&
                              value.requestStatus !== 'Awaiting assignment' &&
                              value.requestStatus !== 'Paused' &&
                              value.requestStatus !== 'Test rejected' &&
                              !(
                                value.test.find(
                                  data => data.testType === 'basic',
                                )?.status === 'Basic failed' &&
                                value.test.find(
                                  data => data.testType === 'skill',
                                )?.status === 'Awaiting assignment'
                              ) &&
                              value.test.find(data => data.testType === 'skill')
                                ?.status !== 'Skill failed' &&
                              value.test.find(data => data.testType === 'skill')
                                ?.status !== 'Cancelled' ? (
                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='secondary'
                                  sx={{ height: '30px' }}
                                  disabled={isDisabled()}
                                  onClick={() => {
                                    onClickRejectOrPause(value, 'pause')
                                  }}
                                >
                                  Pause
                                </Button>
                              ) : value.requestStatus === 'Paused' ? (
                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='primary'
                                  sx={{ height: '30px' }}
                                  onClick={() => {
                                    onClickResumeTest(value)
                                  }}
                                  disabled={isDisabled()}
                                >
                                  Resume
                                </Button>
                              ) : null}
                              {value.requestStatus === 'Test rejected' ||
                              value.requestStatus === 'Paused' ? (
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
                                        value.requestStatus,
                                        value.messageToUser!,
                                        value.reason!,
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
                          </Box>
                          <CardContent
                            sx={{
                              padding: 0,
                              paddingTop: '10px',
                              paddingBottom: '0 !important',
                            }}
                          >
                            <Typography
                              variant='subtitle2'
                              sx={{
                                fontWeight: 600,
                                minHeight: '20px',
                                lineHeight: '20px',
                                letterSpacing: ' 0.15px',
                              }}
                            >
                              {value.source &&
                              value.target &&
                              value.source !== '' &&
                              value.target !== '' ? (
                                <>
                                  {value.source.toUpperCase()} &rarr;{' '}
                                  {value.target.toUpperCase()}
                                </>
                              ) : (
                                ''
                              )}
                            </Typography>

                            <Grid item display='flex' gap={4} mt={4}>
                              {getStatusButton(value)}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })
              : null}
            {userInfo && userInfo.length ? (
              <Grid
                item
                xs={12}
                sx={{
                  padding: '0 !important',
                  marginBottom: '10px',
                }}
              >
                <CustomPagination
                  listCount={userInfo.length}
                  page={page}
                  handleChangePage={handleChangePage}
                  rowsPerPage={rowsPerPage}
                />
              </Grid>
            ) : null}
          </Grid>
        </Box>
      ) : null}
    </Card>
  )
}

export default AppliedRole
