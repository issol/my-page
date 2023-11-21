import Card from '@mui/material/Card'

import Divider from '@mui/material/Divider'

import CardContent from '@mui/material/CardContent'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import CustomPagination from 'src/pages/components/custom-pagination'
import Grid from '@mui/material/Grid'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import Chip from 'src/@core/components/mui/chip'
import TextField from '@mui/material/TextField'
import { log } from 'console'
import { ClientUserType, UserDataType } from '@src/context/types'

import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { ProJobFeedbackType } from '@src/types/jobs/jobs.type'
import { Icon } from '@iconify/react'
import Image from 'next/image'

type Props = {
  feedbacks: ProJobFeedbackType[] | undefined
  useJobFeedbackForm: boolean
  setUseJobFeedbackForm: (n: boolean) => void
  auth?: {
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }
  addJobFeedbackData: string
  setAddJobFeedbackData: (n: string) => void
  onClickAddFeedback: () => void
  onClickDiscardFeedback: () => void
  page: number
  rowsPerPage: number
  offset: number
  handleChangePage: (direction: string) => void
  canUseAddComment: boolean
}

export default function JobFeedback({
  feedbacks,
  useJobFeedbackForm,
  setUseJobFeedbackForm,
  auth,
  addJobFeedbackData,
  setAddJobFeedbackData,
  onClickAddFeedback,
  onClickDiscardFeedback,
  page,
  rowsPerPage,
  offset,
  handleChangePage,
  canUseAddComment,
}: Props) {

  if (!feedbacks) {
    return null
  } else {
    feedbacks?.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }

  return (
    <Card sx={{ padding: '20px' }}>
      <Typography
        variant='h6'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 0,
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
          Job feedback
        </Box>
        {useJobFeedbackForm ? null : (
          canUseAddComment ? (
            <Button
              variant='contained'
              onClick={() => setUseJobFeedbackForm(true)}
            >
              Add feedback
            </Button>
          ) : null
        )}
      </Typography>
      {feedbacks && feedbacks.length ? (
        <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
      ) : null}

      <CardContent sx={{ padding: 0 }}>
        {useJobFeedbackForm ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginTop: '14px',
              marginBottom: '14px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <Chip
                  size='small'
                  skin='light'
                  label={'Writer'}
                  color='error'
                  sx={{
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { lineHeight: '18px' },
                    mr: 1,
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '21px',
                    letterSpacing: '0.1px',
                    color: '#666CFF',
                  }}
                >
                  {getLegalName({
                    firstName: auth?.user?.firstName,
                    middleName: auth?.user?.middleName,
                    lastName: auth?.user?.lastName,
                  })}
                </Typography>
                <Divider orientation='vertical' variant='middle' flexItem />
                <Typography
                  variant='body2'
                  sx={{
                    fontSize: '14px',

                    lineHeight: '21px',
                    letterSpacing: '0.15px',
                  }}
                >
                  {auth?.user?.email}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <TextField
                fullWidth
                rows={4}
                value={addJobFeedbackData}
                placeholder='Write down a job description.'
                onChange={event => {
                  setAddJobFeedbackData(event.target.value)
                }}
                multiline
                id='textarea-outlined-static'
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'end',
                }}
              >
                <Button
                  variant='outlined'
                  size='small'
                  onClick={onClickDiscardFeedback}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  onClick={onClickAddFeedback}
                >
                  Confirm
                </Button>
              </Box>
              {feedbacks && feedbacks.length ? (
                <Divider
                  sx={{ my: theme => `${theme.spacing(4)} !important` }}
                />
              ) : null}
            </Box>
          </Box>
        ) : null}
        {feedbacks && feedbacks.length ? (
          feedbacks
            .slice(offset, offset + rowsPerPage)
            .map(value => {
              return (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Chip
                          size='small'
                          skin='light'
                          label={'Writer'}
                          color='error'
                          sx={{
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { lineHeight: '18px' },
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant='body1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '21px',
                            letterSpacing: '0.1px',
                            color:
                              value.email === auth?.user?.email
                                ? '#666CFF'
                                : 'rgba(76, 78, 100, 0.87)',
                          }}
                        >
                          {value.name}
                        </Typography>
                        <Divider
                          orientation='vertical'
                          variant='middle'
                          flexItem
                        />
                        <Typography
                          variant='body2'
                          sx={{
                            fontSize: '14px',

                            lineHeight: '21px',
                            letterSpacing: '0.15px',
                          }}
                        >
                          {value.email}
                        </Typography>
                      </Box>
                      { value.isChecked ? (
                            <Box display='flex' justifyContent='flex-end'>
                              <Image
                                src='/images/icons/job-icons/icon-check.svg'
                                alt='logo'
                                width={44}
                                height={24}
                              />
                              <Typography
                                variant='body1'
                                sx={{
                                  color:'rgba(76, 78, 100, 0.6)',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  lineHeight: '21px',
                                  letterSpacing: '0.15px',
                                }}
                              >
                                {'Read by Pro'}
                              </Typography>
                            </Box>
                          ) : null
                        }
                      {/* comment edit/delete 컴포넌트, 추후 사용시 활용(맞춰야 함) */}
                      {/* <Box sx={{ display: 'flex' }}>
                        {selectedComment && selectedComment?.id === value.id ? (
                          <></>
                        ) : (
                          <>
                            {ability.can(
                              'update',
                              new pro_comment(value.userId),
                            ) && value.userId === user.userId ? (
                              <IconButton
                                sx={{ padding: 1 }}
                                onClick={() => onClickEditComment(value)}
                              >
                                <Icon icon='mdi:pencil-outline' />
                              </IconButton>
                            ) : null}
                            {ability.can(
                              'delete',
                              new pro_comment(value.userId),
                            ) ? (
                              <IconButton
                                sx={{ padding: 1 }}
                                onClick={() => onClickDeleteComment(value)}
                              >
                                <Icon icon='mdi:delete-outline' />
                              </IconButton>
                            ) : null}
                          </>
                        )}
                      </Box> */}
                    </Box>
                    <Box>
                      <Typography variant='body2'>
                        {FullDateTimezoneHelper(value.createdAt, auth?.user?.timezone)}
                      </Typography>
                    </Box>
                    {/* comment edit/delete 컴포넌트, 추후 사용시 활용(맞춰야 함) */}
                    {/* {selectedComment && selectedComment?.id === value.id ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <TextField
                          fullWidth
                          rows={4}
                          value={comment}
                          onChange={handleCommentChange}
                          multiline
                          id='textarea-outlined-static'
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'end',
                          }}
                        >
                          <Button
                            variant='outlined'
                            size='small'
                            onClick={onClickEditCancelComment}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant='contained'
                            size='small'
                            onClick={onClickEditConfirmComment}
                          >
                            Confirm
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>{value.comment}</Box>
                    )} */}
                    <Box>{value.feedback}</Box>
                  </Box>
                  
                  <Divider
                    sx={{ my: theme => `${theme.spacing(4)} !important` }}
                  />
                </>
              )
            })
        ) : useJobFeedbackForm ? null : (
          <Box>-</Box>
        )}
        {feedbacks && feedbacks.length ? (
          <Grid item xs={12}>
            <CustomPagination
              listCount={feedbacks.length}
              page={page}
              handleChangePage={handleChangePage}
              rowsPerPage={rowsPerPage}
            />
          </Grid>
        ) : (
          <Grid></Grid>
        )}
      </CardContent>
    </Card>
  )
}
