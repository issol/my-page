import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Icon from 'src/@core/components/icon'
import Avatar from '@mui/material/Avatar'
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
import {
  OnboardingUserType,
  SelectedJobInfoType,
  TestHistoryType,
} from 'src/types/onboarding/list'
import languageHelper from 'src/shared/helpers/language.helper'
import Chip from 'src/@core/components/mui/chip'
import { TestStatusColor } from 'src/shared/const/chipColors'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  userInfo: OnboardingUserType
  selectedJobInfo: SelectedJobInfoType | null
  onClickAction: (jobInfoId: number, status: string) => void
  onClickTestDetails: (history: SelectedJobInfoType) => void
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
  return (
    <Card sx={{ padding: '20px' }}>
      <CardHeader title='Certification Test' sx={{ padding: 0 }}></CardHeader>
      {selectedJobInfo ? (
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
                  General Test
                </Typography>
                <Card
                  sx={{
                    mt: 2,

                    background:
                      selectedJobInfo.status === 'Test in progress' ||
                      selectedJobInfo.status === 'Test submitted' ||
                      selectedJobInfo.status === 'Reviewing' ||
                      selectedJobInfo.status === 'Test failed' ||
                      selectedJobInfo.status === 'Review completed'
                        ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128'
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
                            {selectedJobInfo?.target} (
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
                        {selectedJobInfo.status === 'Test assigned' ? (
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
                        ) : selectedJobInfo.status === 'General in progress' ? (
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
                        ) : selectedJobInfo.status === 'Test in progress' ||
                          selectedJobInfo.status === 'Test submitted' ||
                          selectedJobInfo.status === 'Reviewing' ||
                          selectedJobInfo.status === 'Test failed' ||
                          selectedJobInfo.status === 'Review completed' ? (
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
                        ) : selectedJobInfo.status === 'General skipped' ? (
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
                    selectedJobInfo.status === 'Test in progress' ||
                    selectedJobInfo.status === 'Test submitted' ||
                    selectedJobInfo.status === 'Reviewing' ||
                    selectedJobInfo.status === 'Review completed' ||
                    selectedJobInfo.status === 'Test failed'
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
                  {selectedJobInfo.status === 'Test in progress' ||
                  selectedJobInfo.status === 'Test submitted' ||
                  selectedJobInfo.status === 'Reviewing' ||
                  selectedJobInfo.status === 'Test failed' ||
                  selectedJobInfo.status === 'Review completed' ? (
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
                      selectedJobInfo.status === 'Test failed'
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
                          {selectedJobInfo.source && selectedJobInfo.target ? (
                            <>
                              {selectedJobInfo.source} &rarr;{' '}
                              {selectedJobInfo.target}
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
                            selectedJobInfo.status === 'Test in progress' ||
                            selectedJobInfo.status === 'Test submitted' ||
                            selectedJobInfo.status === 'Reviewing' ||
                            selectedJobInfo.status === 'Test failed' ||
                            selectedJobInfo.status === 'Review completed'
                              ? selectedJobInfo.status
                              : '-'
                          }
                          /* @ts-ignore */
                          customColor={
                            TestStatusColor[
                              selectedJobInfo.status === 'Test in progress' ||
                              selectedJobInfo.status === 'Test submitted' ||
                              selectedJobInfo.status === 'Reviewing' ||
                              selectedJobInfo.status === 'Test failed' ||
                              selectedJobInfo.status === 'Review completed'
                                ? selectedJobInfo.status
                                : 'default'
                            ]
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
