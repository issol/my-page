// ** React Imports
import { MouseEvent, Suspense, SyntheticEvent, useState } from 'react'

// ** styled components
import { styled } from '@mui/system'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** nextJS
import { useRouter } from 'next/router'

// ** types
import { useGetOnboardingProDetails } from '@src/queries/onboarding/onboarding-query'
import Overview from '@src/@core/components/card-statistics/card-overview'
import ProDetailOverviews from '../../../../../views/pro/overview'

import ProjectsDetail from '../../../../../views/pro/projects'
import PaymentInfo from '../../../../../views/pro/payment-info'
import UserInfoCard from '@src/@core/components/userInfo'
import logger from '@src/@core/utils/logger'
import { useGetProOverview } from '@src/queries/pro/pro-details.query'
import FallbackSpinner from '@src/@core/components/spinner'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useAppSelector } from '@src/hooks/useRedux'
import ProInvoices from '../../../../../views/pro/invoices'
import { getCurrentRole } from '@src/shared/auth/storage'

const ProDetail = () => {
  const router = useRouter()

  const { id } = router.query
  const [value, setValue] = useState<string>('overview')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const { data: userInfo } = useGetProOverview(Number(id!))
  const currentRole = getCurrentRole()

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
            value='overview'
            label='Overview'
            iconPosition='start'
            icon={<Icon icon='material-symbols:person-outline' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />

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
            {id && <ProInvoices id={Number(id)} />}
          </TabPanel>
        )}
        <TabPanel value='overview'>
          <ProDetailOverviews />
        </TabPanel>
        <TabPanel value='paymentInfo'>
          <Suspense fallback={<FallbackSpinner />}>
            {id && (
              <PaymentInfo id={Number(id)} userRole={currentRole?.name!} />
            )}
          </Suspense>
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
  padding: 0 27px;
`

export default ProDetail