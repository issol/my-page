import Card from '@mui/material/Card'

import styled from 'styled-components'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { CertifiedRoleType } from 'src/types/onboarding/details'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
type Props = {
  userInfo: CertifiedRoleType[]
}

export default function CertifiedRole({ userInfo }: Props) {
  return (
    <Card sx={{ padding: '20px' }}>
      <CardHeader title='Certified roles' sx={{ padding: 0 }}></CardHeader>
      <Divider sx={{ my: theme => `${theme.spacing(7)} !important` }} />
      <CardContent sx={{ padding: 0 }}>
        {userInfo.length ? (
          <Box sx={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
            {userInfo.map((value, index) => {
              return (
                <Box key={uuidv4()} sx={{ display: 'flex', gap: '8px' }}>
                  <Box>
                    <Typography variant='body1'>{index + 1}.</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      gap: '5px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,

                        width: '100%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 600, lineHeight: '24px' }}
                      >
                        {value.jobType}
                      </Typography>
                      <Divider
                        orientation='vertical'
                        variant='fullWidth'
                        flexItem
                      />{' '}
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 600, lineHeight: '24px' }}
                      >
                        {value.role}
                      </Typography>
                    </Box>

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
                  </Box>
                </Box>
              )
            })}
          </Box>
        ) : (
          <Box>-</Box>
        )}
      </CardContent>
    </Card>
  )
}
