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

type Props = {
  userInfo: OnboardingProDetailsType
  selectedJobInfo: AppliedRoleType | null
  onClickBasicTestAction: (jobInfo: AppliedRoleType, type: string) => void
  onClickTestDetails: (history: AppliedRoleType, type: string) => void
  onClickCertify: (jobInfo: AppliedRoleType) => void
  onClickSkillTestFail: (jobInfo: AppliedRoleType) => void
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
  onClickSkillTestFail,
}: Props) {
  const [basicTest, setBasicTest] = useState<TestType | null>(null)
  const [skillTest, setSkillTest] = useState<TestType | null>(null)

  const verifiedNoTest = (jobInfo: AppliedRoleType) => {
    const noBasic = jobInfo.test.filter(
      value => value.status === 'NO_TEST' && value.testType === 'basic',
    )

    const noSkill = jobInfo.test.filter(
      value => value.status === 'NO_TEST' && value.testType === 'skill',
    )

    console.log(noBasic)
    console.log(noSkill)

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
      setBasicTest(basic!)
      setSkillTest(skill!)
    }
  }, [selectedJobInfo])
  return (
    <Card
      sx={{
        padding: '20px',
        background:
          selectedJobInfo && selectedJobInfo.requestStatus === 'Paused'
            ? 'rgba(76, 78, 100, 0.12);'
            : '#ffffff',
      }}
    >
      <CardHeader title='Certification Test' sx={{ padding: 0 }}></CardHeader>
      {selectedJobInfo &&
      selectedJobInfo.requestStatus !== 'Awaiting assignment' &&
      selectedJobInfo.requestStatus !== 'Rejected' ? (
        <CardContent sx={{ padding: 0, mt: '24px' }}>
          <Timeline sx={{ my: 0, py: 0 }}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='warning' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent
                sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}
              >
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  Basic Test
                </Typography>
                {basicTest ? (
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
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                          {selectedJobInfo.requestStatus === 'Test assigned' ? (
                            <>
                              <Button
                                variant='contained'
                                onClick={() =>
                                  onClickBasicTestAction(
                                    selectedJobInfo,
                                    'skip',
                                  )
                                }
                              >
                                Skip
                              </Button>
                              <Button
                                variant='contained'
                                onClick={() =>
                                  onClickBasicTestAction(
                                    selectedJobInfo,
                                    'Basic in progress',
                                  )
                                }
                              >
                                Proceed
                              </Button>
                            </>
                          ) : basicTest!.status === 'Basic in progress' ? (
                            <Box sx={{ display: 'flex', gap: '8px' }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '24px',
                                  letterSpacing: '0.4px',
                                  color: 'rgba(76, 78, 100, 0.87)',
                                }}
                              >
                                In progress
                              </Typography>
                              <CircularProgress size={20} />
                            </Box>
                          ) : selectedJobInfo.testStatus === 'Basic failed' ? (
                            <Box sx={{ display: 'flex', gap: '8px' }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '24px',
                                  letterSpacing: '0.4px',
                                  color: 'rgba(76, 78, 100, 0.87)',
                                }}
                              >
                                Failed
                              </Typography>
                              <img src='/images/icons/onboarding-icons/general-failed.svg' />
                            </Box>
                          ) : selectedJobInfo.testStatus ===
                              'Test in progress' ||
                            selectedJobInfo.testStatus === 'Test submitted' ||
                            selectedJobInfo.testStatus === 'Reviewing' ||
                            selectedJobInfo.testStatus === 'Test failed' ||
                            selectedJobInfo.testStatus ===
                              'Review completed' ? (
                            <Box sx={{ display: 'flex', gap: '8px' }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '24px',
                                  letterSpacing: '0.4px',
                                  color: 'rgba(76, 78, 100, 0.87)',
                                }}
                              >
                                Passed
                              </Typography>

                              <img src='/images/icons/onboarding-icons/general-passed.svg' />
                            </Box>
                          ) : basicTest!.status === 'Skipped' ? (
                            <Box sx={{ display: 'flex', gap: '8px' }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  fontSize: '13px',
                                  lineHeight: '18px',
                                  letterSpacing: '0.16px',
                                  color: '#64C623',
                                }}
                              >
                                Skipped
                              </Typography>
                            </Box>
                          ) : selectedJobInfo.test.find(
                              value => value.testType === 'basic',
                            )?.status === 'NO_TEST' ? (
                            <Chip
                              size='small'
                              type='testStatus'
                              label={'No test'}
                              /* @ts-ignore */
                              customcolor={'#6D788D'}
                              sx={{
                                '& .MuiChip-label': { lineHeight: '18px' },
                                mr: 1,
                              }}
                            />
                          ) : null}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ) : null}
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              {skillTest ? (
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
                        skillTest!.status === 'Reviewing' ? (
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 500,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            // onClick={() => onClickTestDetails(selectedJobInfo)}
                          >
                            See response
                          </Typography>
                        ) : null}
                        <Divider
                          orientation='vertical'
                          variant='fullWidth'
                          flexItem
                        />
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
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              onClickTestDetails(selectedJobInfo, 'detail')
                            }
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
                            {skillTest!.status === 'Skill submitted' ? (
                              <Button
                                variant='contained'
                                onClick={() =>
                                  onClickTestDetails(
                                    selectedJobInfo,
                                    'reviewer',
                                  )
                                }
                              >
                                Assign reviewer
                              </Button>
                            ) : skillTest!.status === 'Review completed' ? (
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                  variant='outlined'
                                  color='error'
                                  onClick={() =>
                                    onClickSkillTestFail(selectedJobInfo)
                                  }
                                >
                                  Fail
                                </Button>
                                <Button
                                  variant='contained'
                                  onClick={() =>
                                    onClickCertify(selectedJobInfo)
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
                </>
              ) : null}
            </TimelineItem>
          </Timeline>
        </CardContent>
      ) : null}
    </Card>
  )
}
