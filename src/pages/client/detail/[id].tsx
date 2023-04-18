// ** React Imports
import { MouseEvent, SyntheticEvent, useState } from 'react'

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

import UserInfoCard from '@src/@core/components/userInfo'
import logger from '@src/@core/utils/logger'
import { useGetProOverview } from '@src/queries/pro/pro-details.query'

export default function ClientDetail() {
  const router = useRouter()

  const { id } = router.query
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const { data: userInfo, isError, isFetched } = useGetProOverview(Number(id!))

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
            value='1'
            label='Projects'
            iconPosition='start'
            icon={<Icon icon='iconoir:large-suitcase' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='2'
            label='Invoices'
            iconPosition='start'
            icon={<Icon icon='material-symbols:person-outline' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='3'
            label='Prices'
            iconPosition='start'
            icon={<Icon icon='carbon:currency-dollar' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='4'
            label='Profile'
            iconPosition='start'
            icon={<Icon icon='carbon:currency-dollar' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='5'
            label='Payment info'
            iconPosition='start'
            icon={<Icon icon='carbon:currency-dollar' />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='1'></TabPanel>
        <TabPanel value='2'></TabPanel>
        <TabPanel value='3'></TabPanel>
      </TabContext>
    </div>
  )
}

ClientDetail.acl = {
  subject: 'client',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`