import { Card, Grid, Typography } from '@mui/material'
import { RoleType } from 'src/context/types'
import { useRouter } from 'next/router'
import { useGetUserInfoWithResume } from 'src/queries/userInfo/userInfo-query'
import { Box } from '@mui/system'

import styled from 'styled-components'
import { UserInfoResType } from 'src/apis/user.api'
import About from '../components/detail/about'
import Tax from '../components/detail/tax'
import AppliedRole from '../components/detail/applied_role'
import Certification from '../components/detail/certification'

export default function OnboardingDetail() {
  const router = useRouter()
  const { id } = router.query

  //** TODO : id로 유저 정보 get해오기 */
  const { data: userInfo } = useGetUserInfoWithResume(21773884430399)

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  function getLegalName(row: UserInfoResType) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? ' (' + row.middleName + ')' : '') +
          ` ${row.lastName}`
  }

  if (!userInfo) {
    return null
  }

  return (
    <Grid container xs={12} spacing={6}>
      <Grid item xs={12}>
        <DesignedCard>
          <Card sx={{ padding: '24px' }}>
            <Box sx={{ position: 'relative', display: 'flex', gap: '30px' }}>
              <Card>
                <img
                  width={110}
                  height={110}
                  src={getProfileImg('TAD')}
                  alt=''
                />
              </Card>
              <Box sx={{ alignSelf: 'self-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Typography variant='h5'>{getLegalName(userInfo)}</Typography>
                  <img
                    width={32}
                    height={32}
                    src='/images/icons/project-icons/onboarding-activate.png'
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
                  {userInfo.legalNamePronunciation
                    ? userInfo.legalNamePronunciation
                    : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </DesignedCard>
      </Grid>
      <Grid item xs={5}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <About userInfo={userInfo} />
          <Tax />
        </Box>
      </Grid>
      <Grid item xs={7}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AppliedRole />
          <Certification />
        </Box>
      </Grid>
    </Grid>
  )
}

// ** TODO : 렐,백엔드와 논의 후 수정
OnboardingDetail.acl = {
  subject: 'onboarding',
  action: 'read',
}

const DesignedCard = styled(Card)`
  position: relative;
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
