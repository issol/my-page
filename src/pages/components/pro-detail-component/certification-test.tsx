import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import languageHelper from 'src/shared/helpers/language.helper'
import Chip from 'src/@core/components/mui/chip'
import { TestStatusColor } from 'src/shared/const/chipColors'

import {
  AppliedRoleType,
  OnboardingProDetailsType,
  TestType,
} from 'src/types/onboarding/details'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  userInfo: OnboardingProDetailsType
  selectedJobInfo: AppliedRoleType | null
  onClickBasicTestAction: (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => void
  onClickTestDetails: (skillTest: TestType, type: string) => void
  onClickCertify: (jobInfo: AppliedRoleType) => void
  onClickSkillTestAction: (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => void
}
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
})

export default function CertificationTest({
  userInfo,
  selectedJobInfo,
  onClickBasicTestAction,
  onClickCertify,
  onClickTestDetails,
  onClickSkillTestAction,
}: Props) {
  const [basicTest, setBasicTest] = useState<TestType | null>(null)
  const [skillTest, setSkillTest] = useState<TestType | null>(null)
  const [paused, setPaused] = useState<boolean>(false)

  const verifiedNoTest = (jobInfo: AppliedRoleType) => {
    const noBasic =
      jobInfo.test.find(value => value.testType === 'basic')?.status ===
      'NO_TEST'

    const noSkill =
      jobInfo.test.find(value => value.testType === 'skill')?.status ===
      'NO_TEST'

    if ((noBasic && noSkill) || (!noBasic && noSkill)) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (selectedJobInfo) {
      const basic = selectedJobInfo.test.find(
        value => value.testType === 'basic',
      )
      const skill = selectedJobInfo.test.find(
        value => value.testType === 'skill',
      )
      const paused = selectedJobInfo.requestStatus === 'Paused'
      setBasicTest(basic!)
      setSkillTest(skill!)
      setPaused(paused)
    }
  }, [selectedJobInfo])
  return (
    <Card
      sx={{
        padding: '20px',
        background: paused ? 'rgba(76, 78, 100, 0.12);' : '#ffffff',
      }}
    >
      <CardHeader title='Certification Test' sx={{ padding: 0 }}></CardHeader>
      {selectedJobInfo &&
      basicTest &&
      skillTest &&
      selectedJobInfo.requestStatus !== 'Awaiting assignment' &&
      selectedJobInfo.requestStatus !== 'Rejected' &&
      selectedJobInfo.role !== 'DTPer' &&
      selectedJobInfo.role !== 'DTP QCer' &&
      selectedJobInfo.jobType !== 'Interpretation' &&
      !verifiedNoTest(selectedJobInfo) ? (
        <CardContent sx={{ padding: 0, mt: '24px' }}>
          <Timeline sx={{ my: 0, py: 0 }}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='warning' />
                <TimelineConnector />
              </TimelineSeparator>
              {basicTest ? (
                <TimelineContent
                  sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}
                >
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      Basic Test
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      {basicTest!.status === 'Basic submitted' ||
                      basicTest!.status === 'Basic failed' ||
                      basicTest!.status === 'Basic passed' ? (
                        <>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '.15px',
                            }}
                          >
                            Score : {basicTest.score ?? 0}
                          </Typography>
                          <Divider
                            orientation='vertical'
                            variant='fullWidth'
                            flexItem
                          />
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 500,
                              textDecoration: 'underline',
                              cursor: paused ? 'unset' : 'pointer',
                            }}
                            onClick={() => {
                              if (!paused) {
                                if (basicTest.testResponseUrl) {
                                  window.open(
                                    basicTest.testResponseUrl,
                                    '_blank',
                                  )
                                } else {
                                  toast.error(
                                    'Something went wrong. Please try again.',
                                    {
                                      position: 'bottom-left',
                                    },
                                  )
                                }
                              }
                            }}
                          >
                            See response
                          </Typography>
                        </>
                      ) : null}
                    </Box>
                  </Box>

                  <Card
                    sx={{
                      mt: 2,

                      background:
                        basicTest!.status === 'Skipped' ||
                        basicTest!.status === 'Basic passed'
                          ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128'
                          : basicTest!.status === 'Basic failed'
                          ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49;'
                          : 'rgba(76, 78, 100, 0.05)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          {selectedJobInfo?.target ? (
                            <>
                              {selectedJobInfo?.target.toUpperCase()} (
                              {languageHelper(
                                selectedJobInfo?.target?.toLowerCase(),
                              )}
                              )
                            </>
                          ) : (
                            '-'
                          )}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                          }}
                        >
                          {basicTest!.status === 'Awaiting assignment' ? (
                            <>
                              <Button
                                variant='contained'
                                onClick={() =>
                                  onClickBasicTestAction(
                                    selectedJobInfo.id,
                                    basicTest,
                                    skillTest,
                                    'Skipped',
                                  )
                                }
                                disabled={paused}
                              >
                                Skip
                              </Button>
                              <Button
                                variant='contained'
                                onClick={() =>
                                  onClickBasicTestAction(
                                    selectedJobInfo.id,
                                    basicTest,
                                    skillTest,
                                    'Basic in progress',
                                  )
                                }
                                disabled={paused}
                              >
                                Proceed
                              </Button>
                            </>
                          ) : (
                            <Chip
                              size='medium'
                              type='testStatus'
                              label={
                                basicTest!.status === 'Basic in progress' ||
                                basicTest!.status === 'Basic submitted' ||
                                basicTest!.status === 'Basic failed' ||
                                basicTest!.status === 'Basic passed' ||
                                basicTest!.status === 'Skipped' ||
                                basicTest!.status === 'NO_TEST'
                                  ? basicTest!.status === 'NO_TEST'
                                    ? 'No test'
                                    : basicTest!.status
                                  : '-'
                              }
                              /* @ts-ignore */
                              customcolor={
                                /* @ts-ignore */
                                TestStatusColor[
                                  basicTest!.status === 'Basic in progress' ||
                                  basicTest!.status === 'Basic submitted' ||
                                  basicTest!.status === 'Basic failed' ||
                                  basicTest!.status === 'Basic passed' ||
                                  basicTest!.status === 'Skipped' ||
                                  basicTest!.status === 'NO_TEST'
                                    ? basicTest!.status
                                    : 'default'
                                ] //@ts-ignore
                              }
                              sx={{
                                '& .MuiChip-label': { lineHeight: '18px' },
                                mr: 1,
                              }}
                            />
                          )}

                          {basicTest!.status === 'Basic submitted' ? (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button
                                variant='outlined'
                                color='error'
                                disabled={paused}
                                onClick={() =>
                                  onClickBasicTestAction(
                                    selectedJobInfo.id,
                                    basicTest,
                                    skillTest,
                                    'Basic failed',
                                  )
                                }
                              >
                                Fail
                              </Button>
                              <Button
                                variant='contained'
                                disabled={paused}
                                onClick={() =>
                                  onClickBasicTestAction(
                                    selectedJobInfo.id,
                                    basicTest,
                                    skillTest,
                                    'Basic passed',
                                  )
                                }
                              >
                                Pass
                              </Button>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              ) : null}
            </TimelineItem>

            <TimelineItem>
              {skillTest && basicTest ? (
                <>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        skillTest!.status === 'Skill in progress' ||
                        skillTest!.status === 'Skill submitted' ||
                        skillTest!.status === 'Skill failed' ||
                        skillTest!.status === 'Reviewing' ||
                        skillTest!.status === 'Review completed' ||
                        skillTest!.status === 'Review canceled'
                          ? 'primary'
                          : 'grey'
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingRight: '10px',
                      }}
                    >
                      <Typography variant='body1' sx={{ fontWeight: 600 }}>
                        Skill Test
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        {skillTest!.status === 'Skill submitted' ||
                        skillTest!.status === 'Reviewing' ||
                        skillTest!.status === 'Review completed' ||
                        skillTest!.status === 'Skill failed' ? (
                          <>
                            <Typography
                              variant='body2'
                              sx={{
                                fontWeight: 500,
                                textDecoration: 'underline',
                                cursor: paused ? 'unset' : 'pointer',
                              }}
                              onClick={() => {
                                if (!paused) {
                                  if (skillTest.testResponseUrl) {
                                    window.open(
                                      skillTest.testResponseUrl,
                                      '_blank',
                                    )
                                  } else {
                                    toast.error(
                                      'Something went wrong. Please try again.',
                                      {
                                        position: 'bottom-left',
                                      },
                                    )
                                  }
                                }
                              }}
                            >
                              See response
                            </Typography>
                            <Divider
                              orientation='vertical'
                              variant='fullWidth'
                              flexItem
                            />
                          </>
                        ) : null}

                        {skillTest!.status === 'Skill in progress' ||
                        skillTest!.status === 'Skill submitted' ||
                        skillTest!.status === 'Skill failed' ||
                        skillTest!.status === 'Reviewing' ||
                        skillTest!.status === 'Review completed' ||
                        skillTest!.status === 'Review canceled' ? (
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 500,
                              textDecoration: 'underline',
                              cursor: paused ? 'unset' : 'pointer',
                            }}
                            onClick={() => {
                              if (!paused) {
                                onClickTestDetails(skillTest, 'detail')
                              }
                            }}
                          >
                            Details
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                    <Card
                      sx={{
                        mt: 2,

                        background:
                          skillTest!.status === 'Skill failed'
                            ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49'
                            : 'rgba(76, 78, 100, 0.05)',
                        boxShadow: 'none',
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography
                              variant='body1'
                              sx={{ fontWeight: 600 }}
                            >
                              {selectedJobInfo.jobType}
                            </Typography>
                            <Divider orientation='vertical' flexItem />
                            <Typography
                              variant='body1'
                              sx={{ fontWeight: 600 }}
                            >
                              {selectedJobInfo.role}
                            </Typography>
                            <Divider orientation='vertical' flexItem />
                            <Typography
                              variant='subtitle2'
                              sx={{ fontWeight: 600, fontSize: '14px' }}
                            >
                              {selectedJobInfo.source &&
                              selectedJobInfo.target &&
                              selectedJobInfo.source !== '' &&
                              selectedJobInfo.target !== '' ? (
                                <>
                                  {selectedJobInfo.source.toUpperCase()} &rarr;{' '}
                                  {selectedJobInfo.target.toUpperCase()}
                                </>
                              ) : (
                                ''
                              )}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'center',
                            }}
                          >
                            {(basicTest!.status === 'Basic failed' ||
                              basicTest!.status === 'Basic passed' ||
                              basicTest!.status === 'NO_TEST') &&
                            skillTest!.status !== 'Cancelled' &&
                            !(
                              skillTest!.status === 'Skill in progress' ||
                              skillTest!.status === 'Skill submitted' ||
                              skillTest!.status === 'Skill failed' ||
                              skillTest!.status === 'Reviewing' ||
                              skillTest!.status === 'Review completed' ||
                              skillTest!.status === 'Review canceled'
                            ) ? null : (
                              <Chip
                                size='medium'
                                type='testStatus'
                                label={
                                  skillTest!.status === 'Skill in progress' ||
                                  skillTest!.status === 'Skill submitted' ||
                                  skillTest!.status === 'Skill failed' ||
                                  skillTest!.status === 'Reviewing' ||
                                  skillTest!.status === 'Review completed' ||
                                  skillTest!.status === 'Review canceled'
                                    ? skillTest!.status
                                    : '-'
                                }
                                /* @ts-ignore */
                                customcolor={
                                  /* @ts-ignore */
                                  TestStatusColor[
                                    skillTest!.status === 'Skill in progress' ||
                                    skillTest!.status === 'Skill submitted' ||
                                    skillTest!.status === 'Skill failed' ||
                                    skillTest!.status === 'Reviewing' ||
                                    skillTest!.status === 'Review completed' ||
                                    skillTest!.status === 'Review canceled'
                                      ? skillTest!.status
                                      : 'default'
                                  ] //@ts-ignore
                                }
                                sx={{
                                  textTransform: 'capitalize',
                                  '& .MuiChip-label': { lineHeight: '18px' },
                                  mr: 1,
                                }}
                              />
                            )}

                            {skillTest!.status === 'Skill submitted' ? (
                              <Button
                                variant='contained'
                                onClick={() =>
                                  onClickTestDetails(skillTest, 'reviewer')
                                }
                                disabled={paused}
                              >
                                Assign reviewer
                              </Button>
                            ) : skillTest!.status === 'Review completed' ? (
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                  variant='outlined'
                                  color='error'
                                  disabled={paused}
                                  onClick={() =>
                                    onClickSkillTestAction(
                                      selectedJobInfo.id,
                                      basicTest,
                                      skillTest,
                                      'Skill failed',
                                    )
                                  }
                                >
                                  Fail
                                </Button>
                                <Button
                                  variant='contained'
                                  disabled={paused}
                                  onClick={() =>
                                    onClickCertify(selectedJobInfo)
                                  }
                                >
                                  Pass
                                </Button>
                              </Box>
                            ) : null}
                            {basicTest!.status === 'Basic failed' &&
                            !(
                              skillTest!.status === 'Cancelled' ||
                              skillTest?.status === 'Skill in progress' ||
                              skillTest!.status === 'Skill submitted' ||
                              skillTest!.status === 'Reviewing' ||
                              skillTest!.status === 'Skill failed' ||
                              skillTest!.status === 'Review completed'
                            ) ? (
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                  variant='outlined'
                                  disabled={paused}
                                  onClick={() =>
                                    onClickSkillTestAction(
                                      selectedJobInfo.id,
                                      basicTest,
                                      skillTest,
                                      'Cancelled',
                                    )
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant='contained'
                                  disabled={paused}
                                  onClick={() =>
                                    onClickSkillTestAction(
                                      selectedJobInfo.id,
                                      basicTest,
                                      skillTest,
                                      'Skill in progress',
                                    )
                                  }
                                >
                                  Proceed
                                </Button>
                              </Box>
                            ) : (basicTest!.status === 'Basic passed' ||
                                basicTest!.status === 'NO_TEST') &&
                              !(
                                skillTest!.status === 'Cancelled' ||
                                skillTest?.status === 'Skill in progress' ||
                                skillTest!.status === 'Skill submitted' ||
                                skillTest!.status === 'Reviewing' ||
                                skillTest!.status === 'Skill failed' ||
                                skillTest!.status === 'Review completed'
                              ) ? (
                              <Button
                                variant='contained'
                                disabled={paused}
                                onClick={() =>
                                  onClickSkillTestAction(
                                    selectedJobInfo.id,
                                    basicTest,
                                    skillTest,
                                    'Skill in progress',
                                  )
                                }
                              >
                                Proceed
                              </Button>
                            ) : null}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </>
              ) : null}
            </TimelineItem>
          </Timeline>
        </CardContent>
      ) : basicTest &&
        basicTest!.status === 'NO_TEST' &&
        selectedJobInfo?.role !== 'DTPer' &&
        selectedJobInfo?.role !== 'DTP QCer' &&
        selectedJobInfo?.jobType !== 'Interpretation' ? (
        <CardContent sx={{ padding: 0, mt: '24px', pb: '0 !important' }}>
          <Timeline sx={{ my: 0, py: 0 }}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='warning' />
                <TimelineConnector />
              </TimelineSeparator>
              {basicTest ? (
                <TimelineContent
                  sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}
                >
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      Basic Test
                    </Typography>
                  </Box>

                  <Card
                    sx={{
                      mt: 2,
                      marginBottom: '0px !important',
                      background: 'rgba(76, 78, 100, 0.05)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          {selectedJobInfo?.target ? (
                            <>
                              {selectedJobInfo?.target.toUpperCase()} (
                              {languageHelper(
                                selectedJobInfo?.target?.toLowerCase(),
                              )}
                              )
                            </>
                          ) : (
                            '-'
                          )}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                          }}
                        >
                          <Chip
                            size='medium'
                            type='testStatus'
                            label={
                              basicTest!.status === 'NO_TEST'
                                ? basicTest!.status === 'NO_TEST'
                                  ? 'No test'
                                  : basicTest!.status
                                : '-'
                            }
                            /* @ts-ignore */
                            customcolor={
                              /* @ts-ignore */
                              TestStatusColor[
                                basicTest!.status === 'NO_TEST'
                                  ? basicTest!.status
                                  : 'default'
                              ] //@ts-ignore
                            }
                            sx={{
                              '& .MuiChip-label': { lineHeight: '18px' },
                              mr: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              ) : null}
            </TimelineItem>
          </Timeline>
        </CardContent>
      ) : null}
    </Card>
  )
}
