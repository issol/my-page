// ** React Imports
import React, { ReactNode, Suspense, useEffect, useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Integrations } from '@sentry/tracing'

// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts

import {
  SettingsConsumer,
  SettingsProvider,
} from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import '../../styles/slick.css'
import '../../styles/slick-theme.css'
import '../../styles/print.css'

import {
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from 'react-query'

import ErrorFallback from 'src/@core/components/error/error-fallback'
import FallbackSpinner from 'src/@core/components/spinner'

/* push notification for demo */
import usePushNotification from '../hooks/pushNotification'
import ModalProvider from 'src/context/ModalContext'
import {
  ClientErrorHandler,
  ApiErrorHandler,
  StatusCode,
} from 'src/shared/sentry-provider'

import logger from '@src/@core/utils/logger'
import ModalContainer from '@src/@core/components/modal-container'
import { ErrorBoundary } from 'react-error-boundary'
import DetailNoUser from '@src/@core/components/error/detail-no-user'
import useAuth from '@src/hooks/useAuth'
import AuthProvider from '@src/shared/auth/auth-provider'

/* msw mock server */
if (process.env.NEXT_PUBLIC_API_MOCKING === 'true') {
  require('../mocks')
}

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  normalizeDepth: 6,
  environment: process.env.NEXT_PUBLIC_BUILD_MODE,
  autoSessionTracking: true,
  tracesSampleRate: 1.0,
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  beforeSend(event, hint) {
    const errorName: Error = hint.originalException as Error
    const errorType = Object.values(StatusCode).includes(errorName?.name)
      ? 'API'
      : 'CLIENT'
    if (errorType === 'API' && event) {
      return event
    } else if (errorType === 'CLIENT') {
      return ClientErrorHandler(event, hint)
    } else {
      return event
    }
  },
})

const clientSideEmotionCache = createEmotionCache()
// const PushAlarm = dynamic<any>(
//   () => import('../views/components/push-alarm').then(m => m),
//   { ssr: false },
// )

const BeusableScriptsDynamic = dynamic(
  () => import('@src/shared/scripts/beusable'),
  {
    suspense: true,
  },
)

const GAScriptsDynamic = dynamic(() => import('@src/shared/scripts/ga'), {
  suspense: true,
})

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const router = useRouter()
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 60 * 1000, // 1
            cacheTime: 1000 * 60 * 1,
            // useErrorBoundary: true,
            refetchOnWindowFocus: false,
            suspense: false,
            retry: false,
            onError: (error: any) => {
              ApiErrorHandler(error)
            },
          },
        },
      }),
  )

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ??
    (page => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ))

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  // const pushNotification = usePushNotification()
  // pushNotification?.fireNotificationWithTimeout('Welcome to TAD DEMO', 50000, {
  //   body: `Welcome to TAD DEMO`,
  // })

  const { reset } = useQueryErrorResetBoundary()
  const [errorString, setErrorString] = useState('app')

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Provider store={store}>
          <CacheProvider value={emotionCache}>
            <Head>
              <title>{`${themeConfig.templateName}`}</title>
              <meta
                name='description'
                content={`${themeConfig.templateName} – E'nuff`}
              />
              <meta name='keywords' content={`E'nuff`} />
              <meta
                name='viewport'
                content='initial-scale=1, width=device-width'
              />
            </Head>
            <Suspense>
              <ErrorBoundary
                onError={err => {
                  console.log(err)
                }}
                onReset={details => {
                  reset()
                  setErrorString('')
                }}
                resetKeys={[errorString]}
                fallbackRender={({ error, resetErrorBoundary }) => {
                  if (
                    !!error.response &&
                    error.response.status === 400 &&
                    (router.asPath.includes('/pro/detail') ||
                      router.asPath.includes('/onboarding/detail'))
                  ) {
                    return <DetailNoUser />
                  } else {
                    return (
                      <ErrorFallback resetErrorBoundary={resetErrorBoundary} />
                    )
                  }
                }}
              >
                <AuthProvider>
                  <SettingsProvider
                    {...(setConfig ? { pageSettings: setConfig() } : {})}
                  >
                    <SettingsConsumer>
                      {({ settings }) => {
                        return (
                          <ThemeComponent settings={settings}>
                            {/* <WindowWrapper> */}
                            <ModalContainer />
                            <ModalProvider selector='modal'>
                              <Guard
                                authGuard={authGuard}
                                guestGuard={guestGuard}
                              >
                                <AclGuard
                                  aclAbilities={aclAbilities}
                                  guestGuard={guestGuard}
                                >
                                  <Suspense fallback={<FallbackSpinner />}>
                                    {getLayout(<Component {...pageProps} />)}
                                    {/* </ErrorBoundary> */}
                                  </Suspense>
                                </AclGuard>
                              </Guard>
                            </ModalProvider>
                            {/* </WindowWrapper> */}
                            <ReactHotToast>
                              <Toaster
                                position={settings.toastPosition}
                                toastOptions={{ className: 'react-hot-toast' }}
                              />
                            </ReactHotToast>
                          </ThemeComponent>
                        )
                      }}
                    </SettingsConsumer>
                  </SettingsProvider>
                </AuthProvider>
              </ErrorBoundary>
            </Suspense>
          </CacheProvider>
        </Provider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
