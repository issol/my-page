import Card from '@mui/material/Card'

import { styled } from '@mui/system'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from '@src/types/onboarding/list'

type Props = {
  userInfo: OnboardingUserType
}

export default function NoteFromPro({ userInfo }: Props) {
  console.log("userInfo", userInfo)
  return (
    <Card sx={{ padding: '20px' }}>
      <CardHeader title='Notes from Pro' sx={{ padding: 0 }}></CardHeader>
      <Divider sx={{ my: theme => `${theme.spacing(7)} !important` }} />
      <CardContent sx={{ padding: 0 }}>
        {userInfo.noteFromUser ?? '-'}
      </CardContent>
    </Card>
  )
}
