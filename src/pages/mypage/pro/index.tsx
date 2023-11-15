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

import { Suspense, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** components
import Header from '../components/header'
import FallbackSpinner from '@src/@core/components/spinner'
import MyAccount from './components/my-account'
import MyPageOverview from './components/overview'
import ProPaymentInfo from './components/payment-info'

// ** apis
import { useGetMyOverview } from '@src/queries/pro/pro-details.query'
import { useGetCertifiedRole } from '@src/queries/onboarding/onboarding-query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'

type MenuType = 'overview' | 'paymentInfo' | 'myAccount'
export default function ProMyPage() {
  const auth = useRecoilValueLoadable(authState)
  const {
    data: userInfo,
    isError,
    isFetched,
    isLoading: isUserInfoLoading,
  } = useGetMyOverview(Number(auth.getValue().user?.userId!))

  const { data: certifiedRoleInfo, isLoading: isCertifiedRoleInfoLoading } = useGetCertifiedRole(Number(auth.getValue().user?.userId!))
  const [value, setValue] = useState<MenuType>('overview')

  const handleChange = (_: any, value: MenuType) => {
    setValue(value)
  }

  return (
    <>
      {auth.state === 'loading' ||
        isUserInfoLoading ||
        isCertifiedRoleInfoLoading ? (
        <OverlaySpinner />
      ) : auth.state === 'hasValue' ? (
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
                  <MyPageOverview
                    userInfo={userInfo!}
                    certifiedRoleInfo={certifiedRoleInfo!}
                    user={auth.getValue().user!}
                  />
                </Suspense>
              </TabPanel>
              <TabPanel value='paymentInfo'>
                <Suspense fallback={<FallbackSpinner />}>
                  <ProPaymentInfo user={auth.getValue().user!} />
                </Suspense>
              </TabPanel>
              <TabPanel value='myAccount'>
                <Suspense fallback={<FallbackSpinner />}>
                  <MyAccount user={auth.getValue().user!} />
                </Suspense>
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      ) : null}
    </>
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
