// ** styled components
import { styled } from '@mui/system'

// ** MUI Imports
import { Box } from '@mui/system'
import { Card, Divider, Typography } from '@mui/material'
import { RoleType } from '@src/context/types'

import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { DetailUserType } from '@src/types/common/detail-user.type'

export type UserInfoCardType = {
  userInfo: DetailUserType
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
            <img width={110} height={110} src={getProfileImg('PRO')} alt='' />
          </Card>

          <Box
            display='flex'
            alignItems='center'
            alignSelf='self-end'
            gap='8px'
            flexDirection='column'
          >
            <Box
              display='flex'
              alignItems='center'
              alignSelf='self-end'
              gap='8px'
              height='32px'
            >
              <Typography variant='h5'>
                {getLegalName({
                  firstName: userInfo.firstName,
                  lastName: userInfo.lastName,
                  middleName: userInfo.middleName,
                })}
              </Typography>
              <Typography fontSize={16} fontWeight={400} color='#8D8E9A'>
                {userInfo?.legalNamePronunciation
                  ? `(${userInfo?.legalNamePronunciation})`
                  : '-'}
              </Typography>
              <Box display='flex' width='24px' height='24px'>
                <img
                  alt=''
                  aria-hidden
                  src={
                    userInfo.isOnboarded && userInfo.isActive
                      ? `/images/icons/onboarding-icons/icon-pro-onboarding.svg`
                      : !userInfo.isOnboarded
                        ? `/images/icons/onboarding-icons/pro-onboarding.png`
                        : userInfo.isOnboarded && !userInfo.isActive
                          ? `/images/icons/onboarding-icons/pro-inactive.png`
                          : ''
                  }
                />
              </Box>

              <Divider
                orientation='vertical'
                flexItem
                variant='middle'
                sx={{
                  color: 'rgba(76, 78, 100, 0.60)',
                  borderWidth: 1,
                }}
              />
              <Typography variant='body2' fontSize={16}>
                {userInfo.email}
              </Typography>
            </Box>
            <Typography
              fontSize={16}
              fontWeight={600}
              color='rgba(76, 78, 100, 0.6)'
              sx={{ alignSelf: 'flex-start' }}
            >
              {userInfo?.experience
                ? `${userInfo?.experience} of experience`
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
