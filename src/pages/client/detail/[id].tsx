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

import StandardPrices from '@src/pages/components/standard-prices'
import ClientProjects from '../components/projects'
import { client } from '@src/shared/const/permission-class'
import { useGetClientMemo } from '@src/queries/client.query'
import ClientProfile from './components/profile'

import { Box } from '@mui/material'
import ClientInvoices from '../components/invoices'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import PaymentInfo from '../components/payment-info'
import FallbackSpinner from '@src/@core/components/spinner'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { roleState } from '@src/states/permission'
import { useQueryClient } from 'react-query'

export default function ClientDetail() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { id } = router.query
  const [value, setValue] = useState<string>('1')

  const ability = useContext(AbilityContext)
  const auth = useRecoilValueLoadable(authState)
  const role = useRecoilValueLoadable(roleState)

  const User = new client(auth.getValue().user?.id!)

  // const isUpdatable = ability.can('update', User)
  // const isDeletable = ability.can('delete', User)
  // const isCreatable = ability.can('create', User)

  const [memoSkip, setMemoSkip] = useState(0)
  const MEMO_PAGESIZE = 3

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
    queryClient.invalidateQueries(['client-projects'])
    queryClient.invalidateQueries(['client-invoices'])
  }
  const { data: userInfo, isError, isFetched } = useGetClientDetail(Number(id!))

  const Writer = new client(userInfo?.authorId!)

  const { data: memo } = useGetClientMemo(Number(id!), {
    skip: memoSkip * MEMO_PAGESIZE,
    take: MEMO_PAGESIZE,
  })

  const isUpdatable = ability.can('update', Writer)
  const isDeletable = ability.can('delete', Writer)
  const isCreatable = ability.can('create', Writer)
  const hasGeneralPermission = () => {
    let flag = false
    if (role.state === 'hasValue' && role.getValue()) {
      role.getValue().map(item => {
        if (
          (item.name === 'LPM' || item.name === 'TAD') &&
          item.type === 'General'
        )
          flag = true
      })
    }
    return flag
  }
  return (
    <Box sx={{ pb: '100px' }}>
      <ClientInfoCard
        userInfo={{
          name: userInfo?.name!,
          clientType: userInfo?.clientType,
        }}
      />
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
            <ClientProjects id={Number(id)} user={auth.getValue().user!} />
          </Suspense>
        </TabPanel>
        <TabPanel value='2'>
          <Suspense>
            <ClientInvoices id={Number(id)} user={auth.getValue().user!} />
          </Suspense>
        </TabPanel>
        <TabPanel value='3'>
          <StandardPrices
            title='Client prices'
            clientId={userInfo?.clientId!}
            page='client'
            used='client'
            hasGeneralPermission={hasGeneralPermission()}
          />
        </TabPanel>
        <TabPanel value='4'>
          <Suspense>
            <ClientProfile
              clientId={id}
              clientInfo={userInfo!}
              memo={memo || { data: [], count: 0 }}
              isUpdatable={isUpdatable}
              isDeletable={isDeletable}
              isCreatable={isCreatable}
            />
          </Suspense>
        </TabPanel>
        <TabPanel value='5'>
          {/* payment info */}
          <Suspense fallback={<FallbackSpinner />}>
            <PaymentInfo clientId={Number(id)} clientInfo={userInfo!} />
          </Suspense>
        </TabPanel>
      </TabContext>
    </Box>
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
