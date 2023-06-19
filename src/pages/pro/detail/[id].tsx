// ** React Imports
import { MouseEvent, SyntheticEvent, useContext, useState } from 'react'

// ** styled components
import styled from 'styled-components'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** nextJS
import { useRouter } from 'next/router'

// ** types
import { useGetOnboardingProDetails } from '@src/queries/onboarding/onboarding-query'
import Overview from '@src/@core/components/card-statistics/card-overview'
import ProDetailOverviews from '../components/overview'

import ProjectsDetail from '../components/projects'
import PaymentInfo from '../components/payment-info'
import UserInfoCard from '@src/@core/components/userInfo'
import logger from '@src/@core/utils/logger'
import { useGetProOverview } from '@src/queries/pro/pro-details.query'
import { AuthContext } from '@src/context/AuthContext'
import { useAppSelector } from '@src/hooks/useRedux'

export default function ProDetail() {
  const router = useRouter()

  const { id } = router.query
  const [value, setValue] = useState<string>('projects')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const { data: userInfo, isError, isFetched } = useGetProOverview(Number(id!))
  const currentRole = useAppSelector(state => state.userAccess.currentRole)

  return (
    <div>
      <UserInfoCard userInfo={userInfo!} />
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='Pro detail Tab menu'
          style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
        >
          <CustomTap
            value='projects'
            label='Projects'
            iconPosition='start'
            icon={<Icon icon='iconoir:large-suitcase' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          {currentRole && currentRole.name === 'LPM' && (
            <CustomTap
              value='invoices'
              label='Invoices'
              iconPosition='start'
              icon={<Icon icon='carbon:currency-dollar' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          )}

          <CustomTap
            value='overview'
            label='Overview'
            iconPosition='start'
            icon={<Icon icon='material-symbols:person-outline' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='paymentInfo'
            label='Payment info'
            iconPosition='start'
            icon={<Icon icon='carbon:currency-dollar' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='projects'>
          {id && <ProjectsDetail id={Number(id)} />}
        </TabPanel>
        {currentRole && currentRole.name === 'LPM' && (
          <TabPanel value='invoices'>
            {id && <ProjectsDetail id={Number(id)} />}
          </TabPanel>
        )}
        <TabPanel value='overview'>
          <ProDetailOverviews />
        </TabPanel>
        <TabPanel value='paymentInfo'>
          {id && <PaymentInfo id={Number(id)} userRole={currentRole?.name!} />}
        </TabPanel>
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
