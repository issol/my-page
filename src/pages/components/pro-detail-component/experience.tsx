import Card from '@mui/material/Card'

import styled from '@emotion/styled'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from 'src/types/onboarding/list'
import TypoGraphy from '@mui/material/Typography'
type Props = {
  userInfo: OnboardingUserType
}

export default function Experience({ userInfo }: Props) {
  return (
    <Card sx={{ padding: '20px', height: '100%' }}>
      <TypoGraphy
        variant='h6'
        sx={{
          padding: 0,
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        Years of experience
      </TypoGraphy>

      <CardContent sx={{ padding: 0 }}>
        <TypoGraphy variant='body1' sx={{ fontWeight: 600 }}>
          {userInfo.experience}
        </TypoGraphy>
      </CardContent>
    </Card>
  )
}
