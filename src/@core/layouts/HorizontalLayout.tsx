// ** MUI Imports
import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** Theme Config Import
import themeConfig from '@src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from '@src/@core/layouts/types'

// ** Components
import Navigation from './components/horizontal/navigation'
import ScrollToTop from '@src/@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'

// ** Util Import
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import { useEffect, useRef } from 'react'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useRecoilValueLoadable } from 'recoil'
import { currentRoleSelector, permissionState } from '@src/states/permission'

const HorizontalLayoutWrapper = styled('div')({
  height: '100%',
  width: '100%',
  display: 'flex',
  ...(themeConfig.horizontalMenuAnimation && { overflow: 'auto' }),
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  width: '100%',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
})

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}))

const HorizontalLayout = (props: LayoutProps) => {
  // ** Props
  const {
    hidden,
    children,
    settings,
    scrollToTop,
    footerProps,
    saveSettings,
    contentHeightFixed,
    horizontalLayoutProps,
  } = props

  // ** Vars
  const ref = useRef<HTMLElement>(null)
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content

  const currentRoleStorage = getCurrentRole()

  const currentRoleState = useRecoilValueLoadable(currentRoleSelector)
  const permission = useRecoilValueLoadable(permissionState)

  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  // TODO : 임시 배경색 넣어둔 부분 - 차후 삭제할 것
  useEffect(() => {
    const current =
      currentRoleState.state === 'hasValue'
        ? currentRoleState.getValue()
        : currentRoleStorage
          ? currentRoleStorage
          : null

    if (permission.state === 'hasValue' && current) {
      switch (current.name) {
        case 'PRO':
          ref?.current?.classList.add('pro_bg')
          break
        case 'CLIENT':
          ref?.current?.classList.add('client_bg')
          break
        default:
          ref?.current?.classList.remove('pro_bg', 'client_bg')
          break
      }
    }
  }, [permission, currentRoleState])

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <MainContentWrapper
        ref={ref}
        className='layout-content-wrapper'
        sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
      >
        {/* Navbar (or AppBar) and Navigation Menu Wrapper */}
        <AppBar
          color='default'
          elevation={skin === 'bordered' ? 0 : 3}
          className='layout-navbar-and-nav-container'
          position={appBar === 'fixed' ? 'sticky' : 'static'}
          sx={{
            mx: 'auto',
            '@media (min-width:1441px)': {
              maxWidth: '100%',
              minWidth: 1440
            },
            '@media (max-width:1440px)': {
              maxWidth: 1440,
              minWidth: 1440,
              width: '100%',
            },
            alignItems: 'center',
            color: 'text.primary',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            ...(appBar === 'static' && { zIndex: 13 }),
            ...(skin === 'bordered' && {
              borderBottom: theme => `1px solid ${theme.palette.divider}`,
            }),
            transition:
              'border-bottom 0.2s ease-in-out, backdrop-filter .25s ease-in-out, box-shadow .25s ease-in-out',
            ...(appBar === 'fixed'
              ? appBarBlur && {
                  backdropFilter: 'blur(8px)',
                  backgroundColor: theme =>
                    hexToRGBA(theme.palette.background.paper, 0.9),
                }
              : {}),
            ...userAppBarStyle,
          }}
          {...userAppBarProps}
        >
          {/* Navbar / AppBar */}
          <Box
            className='layout-navbar'
            sx={{
              width: '100%',
              ...(navHidden
                ? {}
                : {
                    borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  }),
            }}
          >
            <Toolbar
              className='navbar-content-container'
              // sx={{
              //   mx: 'auto',
              //   ...(contentWidth === 'boxed' && {
              //     '@media (min-width:1440px)': { maxWidth: 1900 },
              //     // '@media (min-width:1440px)': { maxWidth: 1440 },
              //   }),
              //   minHeight: theme =>
              //     `${
              //       (theme.mixins.toolbar.minHeight as number) - 1
              //     }px !important`,
              // }}
                sx={{
                  mx: 'auto',
                  '@media (min-width:1441px)': {
                    maxWidth: 1900,
                    minWidth: 1440
                  },
                  '@media (max-width:1440px)': {
                    maxWidth: 1440,
                    minWidth: 1440,
                    width: '100%',
                  },
                  minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 1}px !important`,
                  width: '100vw', // 전체 뷰포트 너비를 사용하도록 설정
                  overflowX: 'auto' // 가로 스크롤을 활성화
                }}
            >
              <AppBarContent
                {...props}
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                appBarContent={horizontalLayoutProps?.appBar?.content}
                appBarBranding={horizontalLayoutProps?.appBar?.branding}
              />
            </Toolbar>
          </Box>

          {/* Navigation Menu */}
          {navHidden ? null : (
            <Box
              className='layout-horizontal-nav'
              sx={{ width: '100%', ...horizontalLayoutProps?.navMenu?.sx }}
            >
              <Toolbar
                className='horizontal-nav-content-container'
                // sx={{
                //   mx: 'auto',
                //   ...(contentWidth === 'boxed' && {
                //     '@media (min-width:1440px)': { maxWidth: 1900 },
                //     // '@media (min-width:1440px)': { maxWidth: 1440 },
                //   }),
                //   minHeight: theme =>
                //     `${
                //       (theme.mixins.toolbar.minHeight as number) -
                //       (skin === 'bordered' ? 1 : 0)
                //     }px !important`,
                // }}
                  sx={{
                    mx: 'auto',
                    '@media (min-width:1441px)': {
                      maxWidth: 1900,
                      minWidth: 1440
                    },
                    '@media (max-width:1440px)': {
                      maxWidth: 1440,
                      minWidth: 1440,
                      width: '100%',
                    },
                    minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 1}px !important`,
                    width: '100vw', // 전체 뷰포트 너비를 사용하도록 설정
                    overflowX: 'auto' // 가로 스크롤을 활성화
                  }}
              >
                {(userNavMenuContent && userNavMenuContent(props)) || (
                  <Navigation
                    {...props}
                    horizontalNavItems={
                      (
                        horizontalLayoutProps as NonNullable<
                          LayoutProps['horizontalLayoutProps']
                        >
                      )?.navMenu?.navItems
                    }
                  />
                )}
              </Toolbar>
            </Box>
          )}
        </AppBar>

        {/* Content */}
        <ContentWrapper
          className='layout-page-content'
          // sx={{
          //   ...(contentHeightFixed && { display: 'flex', overflow: 'hidden' }),
          //   ...(contentWidth === 'boxed' && {
          //     mx: 'auto',
          //     '@media (min-width:1440px)': { maxWidth: 1900 },
          //     // '@media (min-width:1440px)': { maxWidth: 1440 },
          //     '@media (min-width:1200px)': { maxWidth: '100%' },
          //   }),
          // }}
            sx={{
              mx: 'auto',
              '@media (min-width:1441px)': {
                maxWidth: 1900,
                minWidth: 1440
              },
              '@media (max-width:1440px)': {
                maxWidth: 1440,
                minWidth: 1440,
                width: '100%',
              },
              minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 1}px !important`,
              width: '100vw', // 전체 뷰포트 너비를 사용하도록 설정
              overflowX: 'auto' // 가로 스크롤을 활성화
            }}
        >
          {children}
        </ContentWrapper>

        {scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className='mui-fixed'>
            <Fab color='primary' size='small' aria-label='scroll back to top'>
              <Icon icon='mdi:arrow-up' />
            </Fab>
          </ScrollToTop>
        )}
      </MainContentWrapper>
    </HorizontalLayoutWrapper>
  )
}

export default HorizontalLayout
