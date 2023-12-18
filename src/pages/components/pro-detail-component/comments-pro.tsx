import Card from '@mui/material/Card'

import styled from 'styled-components'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import {
  CommentsOnProType,
  OnboardingUserType,
} from 'src/types/onboarding/list'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import CustomPagination from 'src/pages/components/custom-pagination'
import Grid from '@mui/material/Grid'
import { convertTimeToTimezone } from 'src/shared/helpers/date.helper'
import Chip from 'src/@core/components/mui/chip'
import { Dispatch, SetStateAction, ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
import { log } from 'console'
import { UserDataType } from '@src/context/types'
import { DetailUserType } from '@src/types/common/detail-user.type'
import pro_comment from '@src/shared/const/permission-class/pro-comment'
import { AnyAbility } from '@casl/ability'
type Props = {
  userInfo: DetailUserType
  user: UserDataType
  page: number
  rowsPerPage: number
  offset: number
  handleChangePage: (direction: string) => void

  onClickEditConfirmComment: () => void
  setClickedEditComment: Dispatch<SetStateAction<boolean>>
  clickedEditComment: boolean
  onClickEditComment: (comment: CommentsOnProType) => void
  selectedComment: CommentsOnProType | null
  handleCommentChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClickEditCancelComment: () => void
  onClickAddComment: () => void
  clickedAddComment: boolean
  comment: string
  onClickAddConfirmComment: () => void
  onClickAddCancelComment: () => void
  handleAddCommentChange: (event: ChangeEvent<HTMLInputElement>) => void
  addComment: string
  onClickDeleteComment: (comment: CommentsOnProType) => void
  ability: AnyAbility
}

export default function CommentsAboutPro({
  userInfo,
  user,
  page,
  rowsPerPage,
  offset,
  handleChangePage,

  onClickEditConfirmComment,
  setClickedEditComment,
  clickedEditComment,
  onClickEditComment,
  selectedComment,
  handleCommentChange,
  onClickEditCancelComment,
  onClickAddComment,
  clickedAddComment,
  comment,
  onClickAddConfirmComment,
  onClickAddCancelComment,
  handleAddCommentChange,
  addComment,
  onClickDeleteComment,
  ability,
}: Props) {
  function getLegalName(row: {
    firstName: string
    middleName: string
    lastName: string
  }) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? ' (' + row.middleName + ')' : '') +
          ` ${row.lastName}`
  }

  if (!userInfo) {
    return null
  } else {
    userInfo.commentsOnPro?.sort((a, b) => {
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
          Comments about Pro
        </Box>
        {clickedAddComment ? null : (
          <Button
            variant='contained'
            onClick={onClickAddComment}
            disabled={!!selectedComment}
          >
            Add comment
          </Button>
        )}
      </Typography>
      {userInfo.commentsOnPro && userInfo.commentsOnPro.length ? (
        <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
      ) : null}

      <CardContent sx={{ padding: 0 }}>
        {clickedAddComment ? (
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
                    firstName: user.firstName!,
                    middleName: user.middleName!,
                    lastName: user.lastName!,
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
                  {user.email}
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
                value={addComment}
                placeholder='What is your comment on this Pro?'
                onChange={handleAddCommentChange}
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
                  onClick={onClickAddCancelComment}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  onClick={onClickAddConfirmComment}
                >
                  Confirm
                </Button>
              </Box>
              {userInfo.commentsOnPro && userInfo.commentsOnPro.length ? (
                <Divider
                  sx={{ my: theme => `${theme.spacing(4)} !important` }}
                />
              ) : null}
            </Box>
          </Box>
        ) : null}
        {userInfo.commentsOnPro && userInfo.commentsOnPro.length ? (
          userInfo.commentsOnPro
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
                              value.userId === user.id
                                ? '#666CFF'
                                : 'rgba(76, 78, 100, 0.87)',
                          }}
                        >
                          {getLegalName({
                            firstName: value.firstName,
                            middleName: value.middleName!,
                            lastName: value.lastName,
                          })}
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
                      <Box sx={{ display: 'flex' }}>
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
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant='body2'>
                        {convertTimeToTimezone(value.updatedAt, user.timezone)}
                      </Typography>
                    </Box>
                    {selectedComment && selectedComment?.id === value.id ? (
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
                    )}
                  </Box>

                  <Divider
                    sx={{ my: theme => `${theme.spacing(4)} !important` }}
                  />
                </>
              )
            })
        ) : clickedAddComment ? null : (
          <Box>-</Box>
        )}
        {userInfo.commentsOnPro && userInfo.commentsOnPro.length ? (
          <Grid item xs={12}>
            <CustomPagination
              listCount={userInfo.commentsOnPro.length}
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
