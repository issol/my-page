import Card from '@mui/material/Card'

import styled from 'styled-components'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from 'src/types/onboarding/list'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import TypoGraphy from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from 'src/@core/components/mui/chip'
type Props = {
  userInfo: OnboardingUserType
}

export default function Specialties({ userInfo }: Props) {
  return (
    <Card sx={{ padding: '20px' }}>
      <TypoGraphy
        variant='h6'
        sx={{
          padding: 0,
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        Specialties
      </TypoGraphy>

      <CardContent sx={{ padding: 0 }}>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {userInfo.specialties && userInfo.specialties.length ? (
            userInfo.specialties.map(value => {
              return (
                <Chip
                  size='small'
                  label={value}
                  skin='light'
                  color='primary'
                  /* @ts-ignore */

                  sx={{
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { lineHeight: '18px' },
                  }}
                />
              )
            })
          ) : (
            <Box>-</Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

const ContractsFileName = styled.div`
  width: 100%;
  // height: 51px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  // line-height: 14px;

  text-align: center;
  letter-spacing: 0.4px;

  color: rgba(76, 78, 100, 0.6);

  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
