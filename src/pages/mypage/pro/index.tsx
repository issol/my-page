// ** style components
import styled from 'styled-components'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { Grid } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** nextJS
import { useRouter } from 'next/router'
import { Suspense, useContext, useState } from 'react'
import { AuthContext } from '@src/context/AuthContext'

// ** components
import Header from '../components/header'
import FallbackSpinner from '@src/@core/components/spinner'
import MyAccount from './components/my-account'
import MyPageOverview from './components/overview'
import ProPaymentInfo from './components/payment-info'

// ** apis
import { useGetMyOverview } from '@src/queries/pro/pro-details.query'

type MenuType = 'overview' | 'paymentInfo' | 'myAccount'
export default function ProMyPage() {
  const router = useRouter()

  const { user } = useContext(AuthContext)
  const {
    data: userInfo,
    isError,
    isFetched,
  } = useGetMyOverview(Number(user?.userId!))

  const [value, setValue] = useState<MenuType>('overview')

  const handleChange = (_: any, value: MenuType) => {
    setValue(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Header userInfo={userInfo!} />
      </Grid>
      <Grid item xs={12}>
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
              onClick={e => e.preventDefault()}
            />
            <CustomTap
              value='paymentInfo'
              label='Payment info'
              iconPosition='start'
              icon={<Icon icon='carbon:currency-dollar' />}
              onClick={e => e.preventDefault()}
            />
            <CustomTap
              value='myAccount'
              label='My account'
              iconPosition='start'
              icon={<Icon icon='material-symbols:security' />}
              onClick={e => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='overview'>
            <Suspense fallback={<FallbackSpinner />}>
              <MyPageOverview userInfo={userInfo!} user={user!} />
            </Suspense>
          </TabPanel>
          <TabPanel value='paymentInfo'>
            <Suspense fallback={<FallbackSpinner />}>
              <ProPaymentInfo userInfo={userInfo!} user={user!} />
            </Suspense>
          </TabPanel>
          <TabPanel value='myAccount'>
            <Suspense fallback={<FallbackSpinner />}>
              <MyAccount user={user!} />
            </Suspense>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

ProMyPage.acl = {
  subject: 'pro_mypage',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`
