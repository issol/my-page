// ** style components

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { Grid } from '@mui/material'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** nextJS
import { MouseEvent, Suspense, useEffect, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** components
import Header from '@src/views/mypage/components/header'
import FallbackSpinner from '@src/@core/components/spinner'

// ** apis
import { useGetMyOverview } from '@src/queries/pro/pro-details.query'
import { useGetCertifiedRole } from '@src/queries/onboarding/onboarding-query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { useRouter } from 'next/router'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import useChangeRouterBlocking from '@src/hooks/useChangeRouterBlocking'
import { styled } from '@mui/system'
import MyPageOverview from '@src/views/mypage/overview'
import ProPaymentInfo from '@src/views/mypage/payment-info'
import MyAccount from '@src/views/mypage/my-account'

type MenuType = 'overview' | 'paymentInfo' | 'myAccount'

const createQueryString = (name: string, value: string) => {
  const params = new URLSearchParams()
  params.set(name, value)
  return params.toString()
}

const TAB_MENU_OPTIONS = [
  {
    label: 'Overview',
    value: 'overview',
    icon: <Icon icon='material-symbols:person-outline' />,
  },
  {
    label: 'Payment info',
    value: 'paymentInfo',
    icon: <Icon icon='carbon:currency-dollar' />,
  },
  {
    label: 'My account',
    value: 'myAccount',
    icon: <Icon icon='material-symbols:security' />,
  },
]

const ProMyPage = () => {
  const router = useRouter()
  const tab = router.query.tabs as MenuType
  const pageFormMethod = useForm<{ currentEditMode: boolean }>({
    defaultValues: { currentEditMode: false },
  })

  const auth = useRecoilValueLoadable(authState)
  const [currentTab, setCurrentTab] = useState<MenuType>(tab || 'overview')

  const { data: userInfo, isLoading: isUserInfoLoading } = useGetMyOverview(
    Number(auth.getValue().user?.userId!),
  )

  const { data: certifiedRoleInfo, isLoading: isCertifiedRoleInfoLoading } =
    useGetCertifiedRole(Number(auth.getValue().user?.userId!))

  const currentEditMode = useWatch({
    control: pageFormMethod.control,
    name: 'currentEditMode',
  })

  const { changePageAlert } = useChangeRouterBlocking({
    isPageChangeShowAlert: currentEditMode,
  })

  useEffect(() => {
    if (router.query.tabs) return
    router.push(`${router.pathname}?${createQueryString('tabs', 'overview')}`)
  }, [])

  const handleChange = (_: any, value: MenuType) => {
    if (currentEditMode) {
      changePageAlert(() => {
        setCurrentTab(value)
      })
      return
    }

    router.push(`${router.pathname}?${createQueryString('tabs', value)}`)
    setCurrentTab(value)
  }

  const changeTab = (e: MouseEvent, curTab: string) => {
    e.preventDefault()
  }

  if (
    auth.state === 'loading' ||
    isUserInfoLoading ||
    isCertifiedRoleInfoLoading
  ) {
    return <OverlaySpinner />
  }

  return (
    <>
      {auth.state === 'hasValue' ? (
        <FormProvider {...pageFormMethod}>
          <Grid container>
            <Grid item xs={12}>
              <Header userInfo={userInfo!} />
            </Grid>
            <Grid item xs={12}>
              <TabContext value={currentTab}>
                <TabList
                  onChange={handleChange}
                  aria-label='Pro detail Tab menu'
                  style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
                >
                  {TAB_MENU_OPTIONS.map(menu => (
                    <CustomTap
                      iconPosition='start'
                      key={`${menu.value}`}
                      value={menu.value}
                      label={menu.label}
                      icon={menu.icon}
                      onClick={e => changeTab(e, menu.value)}
                    />
                  ))}
                </TabList>
                <TabPanel value='overview' sx={{ paddingTop: '24px' }}>
                  <Suspense fallback={<FallbackSpinner />}>
                    <MyPageOverview
                      userInfo={userInfo!}
                      certifiedRoleInfo={certifiedRoleInfo!}
                      user={auth.getValue().user!}
                    />
                  </Suspense>
                </TabPanel>
                <TabPanel value='paymentInfo' sx={{ paddingTop: '24px' }}>
                  <Suspense fallback={<FallbackSpinner />}>
                    <ProPaymentInfo user={auth.getValue().user!} />
                  </Suspense>
                </TabPanel>
                <TabPanel value='myAccount' sx={{ paddingTop: '24px' }}>
                  <Suspense fallback={<FallbackSpinner />}>
                    <MyAccount user={auth.getValue().user!} />
                  </Suspense>
                </TabPanel>
              </TabContext>
            </Grid>
          </Grid>
        </FormProvider>
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
  padding: 0 27px;
`

export default ProMyPage
