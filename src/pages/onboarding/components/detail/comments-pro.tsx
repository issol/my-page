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
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import Chip from 'src/@core/components/mui/chip'
import { Dispatch, SetStateAction, ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
type Props = {
  userInfo: CommentsOnProType[]
  user: any
  page: number
  rowsPerPage: number
  offset: number
  handleChangePage: (direction: string) => void
  userId: number
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
}

export default function CommentsAboutPro({
  userInfo,
  user,
  page,
  rowsPerPage,
  offset,
  handleChangePage,
  userId,
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
}: Props) {
  console.log(user)

  function getLegalName(row: CommentsOnProType) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? ' (' + row.middleName + ')' : '') +
          ` ${row.lastName}`
  }

  if (!userInfo) {
    return null
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
        <Button
          variant='contained'
          onClick={onClickAddComment}
          disabled={!!selectedComment}
        >
          Add comment
        </Button>
      </Typography>
      <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
      <CardContent sx={{ padding: 0 }}>
        {clickedAddComment ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  {getLegalName(user)}
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
              <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
            </Box>
          </Box>
        ) : null}
        {userInfo &&
          userInfo.slice(offset, offset + rowsPerPage).map(value => {
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
                            value.userId === userId
                              ? '#666CFF'
                              : 'rgba(76, 78, 100, 0.87)',
                        }}
                      >
                        {getLegalName(value)}
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
                          {value.userId === userId ? (
                            <>
                              <IconButton
                                sx={{ padding: 1 }}
                                onClick={() => onClickEditComment(value)}
                              >
                                <Icon icon='mdi:pencil-outline' />
                              </IconButton>
                            </>
                          ) : null}
                          <IconButton
                            sx={{ padding: 1 }}
                            onClick={() => onClickDeleteComment(value)}
                          >
                            <Icon icon='mdi:delete-outline' />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant='body2'>
                      {FullDateTimezoneHelper(value.updatedAt)}
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
          })}
        <Grid item xs={12}>
          <CustomPagination
            listCount={userInfo.length}
            page={page}
            handleChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </CardContent>
    </Card>
  )
}