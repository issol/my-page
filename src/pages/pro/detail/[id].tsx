// ** React Imports
import { MouseEvent, SyntheticEvent, useState } from 'react'

// ** styled components
import styled from 'styled-components'

// ** MUI Imports
import { Box } from '@mui/system'
import { Card, Grid, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** nextJS
import { useRouter } from 'next/router'

// ** helpers
import { getLegalName } from 'src/shared/helpers/legalname.helper'

// ** types
import { RoleType } from '@src/context/types'
import { useGetOnboardingProDetails } from '@src/queries/onboarding/onboarding-query'
import Overview from '@src/@core/components/card-statistics/card-overview'
import ProDetailOverviews from '../components/overview'

import ProjectsDetail from '../components/projects'
import PaymentInfo from '../components/payment-info'

export default function ProDetail() {
  const router = useRouter()

  const { id } = router.query
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const {
    data: userInfo,
    isError,
    isFetched,
  } = useGetOnboardingProDetails(Number(id!))
  // const userInfo = {
  //   legalNamePronunciation: 'hi',
  //   firstName: 'kim',
  //   lastName: 'bon',
  // }

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  return (
    <div>
      <DesignedCard>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ position: 'relative', display: 'flex', gap: '30px' }}>
            <Card>
              <img width={110} height={110} src={getProfileImg('PRO')} alt='' />
            </Card>
            <Box sx={{ alignSelf: 'self-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography variant='h5'>{getLegalName(userInfo!)}</Typography>
                <img
                  width={32}
                  height={32}
                  /* TODO: 프로 상태에 따라 active, deactive 표기 */
                  src={'/images/icons/project-icons/pro-activated.png'}
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

      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='Pro detail Tab menu'
          style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
        >
          <CustomTap
            value='1'
            label='Projects'
            iconPosition='start'
            icon={<Icon icon='iconoir:large-suitcase' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='2'
            label='Overview'
            iconPosition='start'
            icon={<Icon icon='material-symbols:person-outline' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='3'
            label='Payment info'
            iconPosition='start'
            icon={<Icon icon='carbon:currency-dollar' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='1'>
          {id && <ProjectsDetail id={Number(id)} />}
        </TabPanel>
        <TabPanel value='2'>
          <ProDetailOverviews />
        </TabPanel>
        <TabPanel value='3'>{id && <PaymentInfo id={Number(id)} />}</TabPanel>
      </TabContext>
    </div>
  )
}

ProDetail.acl = {
  subject: 'pro',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`
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
