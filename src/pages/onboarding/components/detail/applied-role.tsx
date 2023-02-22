import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingJobInfoType } from 'src/types/onboarding/list'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import { v4 as uuidv4 } from 'uuid'
import CustomPagination from 'src/pages/components/custom-pagination'

import FormControlLabel from '@mui/material/FormControlLabel'

type Props = {
  userInfo: Array<OnboardingJobInfoType>
  handleHideFailedTestChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  hideFailedTest: boolean
  selectedJobInfo: OnboardingJobInfoType | null
  handleClickRoleCard: (jobInfo: OnboardingJobInfoType) => void
  page: number
  rowsPerPage: number
  offset: number
  handleChangePage: (direction: string) => void
  onClickCertify: (jobInfoId: number) => void
  onClickAction: (jobInfoId: number, status: string) => void
  onClickAddRole: () => void
  onClickReject: (jobInfo: OnboardingJobInfoType) => void
}

export default function AppliedRole({
  userInfo,
  handleHideFailedTestChange,
  hideFailedTest,
  selectedJobInfo,
  handleClickRoleCard,
  page,
  offset,
  rowsPerPage,
  handleChangePage,
  onClickCertify,
  onClickAction,
  onClickAddRole,
  onClickReject,
}: Props) {
  const getStatusButton = (jobInfo: OnboardingJobInfoType) => {
    if (jobInfo.testStatus === 'Awaiting assignment') {
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
                  onClickReject(jobInfo)
                }}
              >
                Reject
              </Button>
            </Grid>
            <Grid item md={8} lg={8} xs={8}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  onClickCertify(jobInfo.id)
                }}
              >
                Certify
              </Button>
            </Grid>
          </>
        )
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
                  onClickReject(jobInfo)
                }}
              >
                Reject
              </Button>
            </Grid>
            <Grid item md={8} lg={8} xs={8}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  onClickAction(jobInfo.id, 'Awaiting assignment')
                }}
              >
                Assign test
              </Button>
            </Grid>
          </>
        )
      }
    } else if (
      jobInfo.testStatus === 'Skill failed' ||
      jobInfo.testStatus === 'Basic failed'
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
          startIcon={
            <img src='/images/icons/onboarding-icons/failed.svg' alt='failed' />
          }
        >
          Failed
        </Button>
      )
    } else if (
      jobInfo.testStatus === 'Basic in progress' ||
      jobInfo.testStatus === 'Basic passed'
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
          startIcon={
            <img
              src='/images/icons/onboarding-icons/general-in-progress.svg'
              alt='in-progress'
            />
          }
        >
          Basic test in progress
        </Button>
      )
    } else if (
      jobInfo.testStatus === 'Skill in progress' ||
      jobInfo.testStatus === 'Skill submitted' ||
      jobInfo.testStatus === 'Reviewing' ||
      jobInfo.testStatus === 'Review completed'
    ) {
      return (
        <Button
          fullWidth
          variant='contained'
          disabled
          sx={{
            background:
              'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF',
            border: ' 1px solid #666CFF',
            color: '#666CFF',

            '&.Mui-disabled': {
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF',
              border: ' 1px solid #666CFF',
              color: '#666CFF',
            },
          }}
          startIcon={
            <img
              src='/images/icons/onboarding-icons/test-in-progress.svg'
              alt='in-progress'
            />
          }
        >
          Skill test in progress
        </Button>
      )
    } else if (jobInfo.testStatus === 'Test assigned') {
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
          startIcon={
            <img
              src='/images/icons/onboarding-icons/test-assigned.svg'
              alt='test-assigned'
            />
          }
        >
          Test assigned
        </Button>
      )
    } else {
      return <Typography></Typography>
    }
  }

  return (
    <Card sx={{ padding: '20px' }}>
      <Typography
        variant='h6'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 0,
          paddingBottom: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}
        >
          Applied Role
          <IconButton
            sx={{
              padding: 0,
            }}
            onClick={onClickAddRole}
          >
            <img
              src='/images/icons/onboarding-icons/add-role.svg'
              alt='add'
            ></img>
          </IconButton>
        </Box>

        <FormControlLabel
          value='start'
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
              Hide failed test
            </Typography>
          }
          labelPlacement='start'
        />
      </Typography>
      <CardContent sx={{ padding: 0 }}>
        <Grid container spacing={6} xs={12}>
          {userInfo &&
            userInfo.slice(offset, offset + rowsPerPage).map(value => {
              return (
                <Grid item lg={6} md={12} sm={12} xs={12} key={uuidv4()}>
                  <Card
                    sx={{
                      padding: '20px',
                      height: '100%',
                      flex: 1,
                      cursor: 'pointer',
                      border:
                        selectedJobInfo && value.id === selectedJobInfo!.id
                          ? '2px solid #666CFF'
                          : '2px solid rgba(76, 78, 100, 0.12)',
                    }}
                    onClick={() => handleClickRoleCard(value)}
                  >
                    <Box>
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 600, lineHeight: '24px' }}
                      >
                        {value.jobType}
                      </Typography>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        {value.role}
                      </Typography>
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
                        sx={{ fontWeight: 600, minHeight: '20px' }}
                      >
                        {value.source && value.target ? (
                          <>
                            {value.source} &rarr; {value.target}
                          </>
                        ) : (
                          ''
                        )}
                      </Typography>

                      <Grid item display='flex' gap='16px' mt={'17px'}>
                        {getStatusButton(value)}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          <Grid item xs={12}>
            <CustomPagination
              listCount={userInfo.length}
              page={page}
              handleChangePage={handleChangePage}
              rowsPerPage={rowsPerPage}
            />
          </Grid>

          {/* </Box> */}
        </Grid>
      </CardContent>
    </Card>
  )
}
