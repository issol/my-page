// ** styled components
import styled from 'styled-components'

// ** MUI Imports
import { Box } from '@mui/system'
import { Button, Card, Typography } from '@mui/material'
import { RoleType } from '@src/context/types'

import { useRouter } from 'next/router'

export type UserInfoCardType = {
  userInfo: {
    clientType: string
    name: string
  }
}
export default function ClientInfoCard({ userInfo }: UserInfoCardType) {
  const router = useRouter()
  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  return (
    <DesignedCard>
      <Card sx={{ padding: '24px' }}>
        <Box sx={{ position: 'relative', display: 'flex', gap: '30px' }}>
          <Card>
            <img
              width={110}
              height={110}
              src={getProfileImg('CLIENT')}
              alt=''
            />
          </Card>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '30px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'rgba(76, 78, 100, 0.6)' }}>
                [{userInfo.clientType}]&nbsp;
              </Typography>
              <Typography variant='h5'>{userInfo.name}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button
                variant='outlined'
                onClick={() => router.push('/quotes/add-new/')}
              >
                Create quote
              </Button>
              <Button
                variant='outlined'
                onClick={() => router.push('/orders/add-new/')}
              >
                Create order
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </DesignedCard>
  )
}

const DesignedCard = styled(Card)`
  position: relative;
  margin-bottom: 28px;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)
      ),
      #72e128;
  }
`
