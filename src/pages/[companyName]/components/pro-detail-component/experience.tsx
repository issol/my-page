import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from '@src/types/onboarding/list'
import TypoGraphy from '@mui/material/Typography'

type Props = {
  userInfo: OnboardingUserType
}

const Experience = ({ userInfo }: Props) => {
  console.log('userInfo.experience', userInfo.experience)
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

export default Experience
