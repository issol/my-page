import Card from '@mui/material/Card'

import styled from 'styled-components'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from 'src/types/onboarding/list'
type Props = {
  userInfo: OnboardingUserType
}

export default function NoteFromPro({ userInfo }: Props) {
  return (
    <Card sx={{ padding: '20px' }}>
      <CardHeader title='Notes from Pro' sx={{ padding: 0 }}></CardHeader>
      <Divider sx={{ my: theme => `${theme.spacing(7)} !important` }} />
      <CardContent sx={{ padding: 0 }}>
        {userInfo.notesFromPro ?? '-'}
      </CardContent>
    </Card>
  )
}
