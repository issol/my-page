import { useState } from 'react'

// ** style components
import { Box, Card, Grid, IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

// ** components
import About from './about'

// ** types
import { UserDataType } from '@src/context/types'

/* TODO:
about : 수정 버튼, 수정 form연결 및 schema
*/

type Props = {
  userInfo: UserDataType
}

export default function MyPageOverview({ userInfo }: Props) {
  const [editProfile, setEditProfile] = useState(false)
  return (
    <Grid container spacing={6}>
      <Grid item xs={4} display='flex' flexDirection='column' gap='24px'>
        <Card sx={{ padding: '20px' }}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            mb='24px'
          >
            <Typography variant='h6'>My profile</Typography>
            <IconButton onClick={() => setEditProfile(!editProfile)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
          <About userInfo={userInfo} />
        </Card>
      </Grid>
    </Grid>
  )
}
