// ** React Imports
import {
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useContext,
  useState,
} from 'react'

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
import { useGetClientDetail } from '@src/queries/client/client-detail'

// ** components
import ClientInfoCard from '@src/@core/components/clientInfo'
import { useGetStandardPrices } from '@src/queries/company/standard-price'
import StandardPrices from '@src/pages/components/standard-prices'
import ClientProjects from '../components/projects'
import { useGetClientMemo } from '@src/queries/client.query'
import ClientProfile from './components/profile'
import { AuthContext } from '@src/context/AuthContext'

export default function ClientDetail() {
  const router = useRouter()

  const { id } = router.query
  const [value, setValue] = useState<string>('1')
  const { user } = useContext(AuthContext)

  const [memoSkip, setMemoSkip] = useState(0)
  const MEMO_PAGESIZE = 3

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const { data: userInfo, isError, isFetched } = useGetClientDetail(Number(id!))

  const { data: standardPrices, isLoading, refetch } = useGetStandardPrices()
  const { data: memo, refetch: refetchMemo } = useGetClientMemo(Number(id!), {
    skip: memoSkip * MEMO_PAGESIZE,
    take: MEMO_PAGESIZE,
  })

  return (
    <div>
      <ClientInfoCard userInfo={userInfo!} />
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
            icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='2'
            label='Invoices'
            iconPosition='start'
            icon={<Icon icon='ic:sharp-receipt-long' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='3'
            label='Prices'
            iconPosition='start'
            icon={
              <Icon icon='mdi:format-list-numbered-rtl' fontSize={'18px'} />
            }
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='4'
            label='Profile'
            iconPosition='start'
            icon={
              <Icon icon='material-symbols:person-outline' fontSize={'18px'} />
            }
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
          <CustomTap
            value='5'
            label='Payment info'
            iconPosition='start'
            icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='1'>
          <Suspense>
            <ClientProjects id={Number(id)} user={user!} />
          </Suspense>
        </TabPanel>
        <TabPanel value='2'></TabPanel>
        <TabPanel value='3'>
          <StandardPrices
            standardPrices={standardPrices!}
            isLoading={isLoading}
            refetch={refetch}
            title='Client prices'
            clientId={userInfo?.clientId!}
          />
        </TabPanel>
        <TabPanel value='4'>
          <ClientProfile
            clientId={id}
            clientInfo={userInfo ?? null}
            memo={memo || { data: [], count: 0 }}
          />
        </TabPanel>
        <TabPanel value='5'></TabPanel>
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
