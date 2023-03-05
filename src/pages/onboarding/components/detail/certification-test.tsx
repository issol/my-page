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
} from 'src/types/onboarding/details'

type Props = {
  userInfo: OnboardingProDetailsType
  selectedJobInfo: AppliedRoleType | null
  onClickAction: (jobInfoId: number, status: string) => void
  onClickTestDetails: (history: AppliedRoleType) => void
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
  onClickAction,
  onClickTestDetails,
}: Props) {
  const verifiedNoTest = (jobInfo: AppliedRoleType) => {
    const noBasic = jobInfo!.test.filter(
      value => value.status === 'NO_TEST' && value.testType === 'basic',
    )
    const noSkill = jobInfo!.test.filter(
      value => value.status === 'NO_TEST' && value.testType === 'skill',
    )
    if ((noBasic && noSkill) || (!noBasic && noSkill)) {
      return true
    } else {
      return false
    }
  }
  return (
    <Card
      sx={{
        padding: '20px',
        background:
          selectedJobInfo && selectedJobInfo.testStatus === 'Paused'
            ? 'rgba(76, 78, 100, 0.12);'
            : '#ffffff',
      }}
    >
      <CardHeader title='Certification Test' sx={{ padding: 0 }}></CardHeader>
      {selectedJobInfo &&
      selectedJobInfo.testStatus !== 'Awaiting assignment' &&
      !verifiedNoTest(selectedJobInfo) ? (
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
                <Card
                  sx={{
                    mt: 2,

                    background:
                      selectedJobInfo.testStatus === 'Skill in progress' ||
                      selectedJobInfo.testStatus === 'Skill submitted' ||
                      selectedJobInfo.testStatus === 'Reviewing' ||
                      selectedJobInfo.testStatus === 'Skill failed' ||
                      selectedJobInfo.testStatus === 'Review completed'
                        ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128'
                        : selectedJobInfo.testStatus === 'General failed'
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
                        {selectedJobInfo.testStatus === 'Test assigned' ? (
                          <>
                            <Button
                              variant='contained'
                              onClick={() =>
                                onClickAction(selectedJobInfo.id, 'Skipped')
                              }
                            >
                              Skip
                            </Button>
                            <Button
                              variant='contained'
                              onClick={() =>
                                onClickAction(selectedJobInfo.id, 'Proceed')
                              }
                            >
                              Proceed
                            </Button>
                          </>
                        ) : selectedJobInfo.testStatus ===
                          'Basic in progress' ? (
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
                        ) : selectedJobInfo.testStatus === 'Test in progress' ||
                          selectedJobInfo.testStatus === 'Test submitted' ||
                          selectedJobInfo.testStatus === 'Reviewing' ||
                          selectedJobInfo.testStatus === 'Test failed' ||
                          selectedJobInfo.testStatus === 'Review completed' ? (
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
                        ) : selectedJobInfo.testStatus === 'General skipped' ? (
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
                              Skipped
                            </Typography>

                            <img src='/images/icons/onboarding-icons/general-skipped.svg' />
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
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    selectedJobInfo.testStatus === 'Test in progress' ||
                    selectedJobInfo.testStatus === 'Test submitted' ||
                    selectedJobInfo.testStatus === 'Reviewing' ||
                    selectedJobInfo.testStatus === 'Review completed' ||
                    selectedJobInfo.testStatus === 'Test failed'
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
                  {selectedJobInfo.testStatus === 'Test in progress' ||
                  selectedJobInfo.testStatus === 'Test submitted' ||
                  selectedJobInfo.testStatus === 'Reviewing' ||
                  selectedJobInfo.testStatus === 'Test failed' ||
                  selectedJobInfo.testStatus === 'Review completed' ? (
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 500,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => onClickTestDetails(selectedJobInfo)}
                    >
                      Details
                    </Typography>
                  ) : null}
                </Box>
                <Card
                  sx={{
                    mt: 2,

                    background:
                      selectedJobInfo.testStatus === 'Test failed'
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
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          {selectedJobInfo.jobType}
                        </Typography>
                        <Divider orientation='vertical' flexItem />
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
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

                      <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Chip
                          size='medium'
                          type='testStatus'
                          label={
                            selectedJobInfo.testStatus === 'Test in progress' ||
                            selectedJobInfo.testStatus === 'Test submitted' ||
                            selectedJobInfo.testStatus === 'Reviewing' ||
                            selectedJobInfo.testStatus === 'Test failed' ||
                            selectedJobInfo.testStatus === 'Review completed'
                              ? selectedJobInfo.testStatus
                              : '-'
                          }
                          /* @ts-ignore */
                          customcolor={
                            /* @ts-ignore */
                            TestStatusColor[
                              selectedJobInfo.testStatus ===
                                'Test in progress' ||
                              selectedJobInfo.testStatus === 'Test submitted' ||
                              selectedJobInfo.testStatus === 'Reviewing' ||
                              selectedJobInfo.testStatus === 'Test failed' ||
                              selectedJobInfo.testStatus === 'Review completed'
                                ? selectedJobInfo.testStatus
                                : 'default'
                            ] //@ts-ignore
                          }
                          sx={{
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { lineHeight: '18px' },
                            mr: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      ) : null}
    </Card>
  )
}
