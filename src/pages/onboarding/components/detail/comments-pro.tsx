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
import Button from '@mui/material/Button'
import CustomPagination from 'src/pages/components/custom-pagination'
import Grid from '@mui/material/Grid'

import Chip from 'src/@core/components/mui/chip'
type Props = {
  userInfo: CommentsOnProType[]
  page: number
  rowsPerPage: number
  offset: number
  handleChangePage: (direction: string) => void
}

export default function CommentsAboutPro({
  userInfo,
  page,
  rowsPerPage,
  offset,
  handleChangePage,
}: Props) {
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
        <Button variant='contained'>Add comment</Button>
      </Typography>
      <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
      <CardContent sx={{ padding: 0 }}>
        {userInfo &&
          userInfo.slice(offset, offset + rowsPerPage).map(value => {
            return (
              <>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
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
                      }}
                    >
                      {getLegalName(value)}
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
                      {value.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='body2'>{value.updatedAt}</Typography>
                  </Box>
                  <Box>{value.comment}</Box>
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
