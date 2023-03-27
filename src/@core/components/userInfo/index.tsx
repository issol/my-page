// ** styled components
import styled from 'styled-components'

// ** MUI Imports
import { Box } from '@mui/system'
import { Card, Typography } from '@mui/material'
import { RoleType } from '@src/context/types'

import { getLegalName } from 'src/shared/helpers/legalname.helper'

export type UserInfoCardType = {
  userInfo: {
    legalNamePronunciation?: string | null | undefined
    firstName: string
    lastName: string
    isActive: boolean
  }
  role?: RoleType
}
export default function UserInfoCard({ userInfo, role }: UserInfoCardType) {
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
              src={getProfileImg(role ?? 'PRO')}
              alt=''
            />
          </Card>
          <Box sx={{ alignSelf: 'self-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography variant='h5'>{getLegalName(userInfo!)}</Typography>
              <img
                width={32}
                height={32}
                src={`/images/icons/project-icons/${
                  userInfo?.isActive ? 'pro-activated' : 'pro-deactivated.png'
                }.png`}
                alt='onboarding'
              />
            </Box>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'rgba(76, 78, 100, 0.6)',
              }}
            >
              {userInfo!.legalNamePronunciation
                ? userInfo!.legalNamePronunciation
                : '-'}
            </Typography>
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
      #666cff;
  }
`
