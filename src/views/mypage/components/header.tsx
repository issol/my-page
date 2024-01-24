// ** styled components
import { styled } from '@mui/system'

// ** MUI Imports
import { Box } from '@mui/system'
import { Card, Divider, Typography } from '@mui/material'
import { RoleType } from '@src/context/types'

import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { DetailUserType } from '@src/types/common/detail-user.type'

type UserInfoCardType = {
  // userInfo: {
  //   legalNamePronunciation?: string | null | undefined
  //   firstName: string
  //   middleName?: string | undefined
  //   lastName: string
  //   role: RoleType
  //   email: string
  // }
  userInfo: DetailUserType
}

export default function Header({ userInfo }: UserInfoCardType) {
  const { firstName, middleName, lastName } = userInfo

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
                {getLegalName({ firstName, middleName, lastName })}
              </Typography>

              <Divider orientation='vertical' />
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
              {userInfo?.legalNamePronunciation
                ? userInfo?.legalNamePronunciation
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
