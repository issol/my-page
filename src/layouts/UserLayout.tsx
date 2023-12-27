// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAppSelector } from '@src/hooks/useRedux'
import {
  LPMMenu,
  TADMenu,
  PROMenu,
  CLIENTMenu,
} from '@src/shared/const/menu/menu'
import { getCurrentRole, getUserDataFromBrowser } from 'src/shared/auth/storage'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'
import { useRecoilValueLoadable } from 'recoil'
import { currentRoleSelector, permissionState } from '@src/states/permission'
import { current } from '@reduxjs/toolkit'
import { HorizontalNavItemsType } from '@src/@core/layouts/types'
import { UserRoleType } from '@src/context/types'
import { useQuery } from 'react-query'
import { getUserBeHealthz } from '@src/apis/common.api'
import ErrorServerMaintenance from '@src/@core/components/error/error-server-maintenance'
import { authState } from '@src/states/auth'
import { setAllTimeZoneList } from '@src/shared/helpers/timezone.helper'
interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const layoutEl = document.querySelector('.layout-content-wrapper')
  const { settings, saveSettings } = useSettings()
  const userData = useRecoilValueLoadable(authState)

  const {
    data: health,
    isError,
    isFetched,
  } = useQuery('healthz', () => getUserBeHealthz(), {
    refetchInterval: 600000,
    refetchIntervalInBackground: true,
    refetchOnMount: 'always',
    // refetchOnWindowFocus: 'always',
    retry: false,
  })

  // const { currentRole } = useAppSelector(state => state.userAccess)
  const currentRoleStorage = getCurrentRole()

  const currentRoleState = useRecoilValueLoadable(currentRoleSelector)
  const permission = useRecoilValueLoadable(permissionState)
  const [sortedMenu, setSortedMenu] = useState<HorizontalNavItemsType>([])

  const [currentRole, setCurrentRole] = useState<UserRoleType | null>(null)

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  const [publicPage, setPublicPage] = useState(false)

  useEffect(() => {
    const user = userData.getValue().user
    setPublicPage(!user)
  }, [userData])

  useEffect(() => {
    const current =
      currentRoleState.state === 'hasValue'
        ? currentRoleState.getValue()
        : currentRoleStorage
        ? currentRoleStorage
        : null

    setCurrentRole(current)

    if (permission.state === 'hasValue' && current) {
      switch (current.name) {
        case 'TAD':
          const tadMenu = HorizontalNavItems()
            .filter(value => {
              return (
                TADMenu.includes(value.title) && value.role?.includes('TAD')
              )
            })
            .sort((a, b) => {
              return (
                TADMenu.findIndex(item => item === a.title) -
                TADMenu.findIndex(item => item === b.title)
              )
            })
          setSortedMenu(tadMenu)
          break
        case 'LPM':
          const lpmMenu = HorizontalNavItems()
            .filter(value => {
              return (
                LPMMenu.includes(value.title) && value.role?.includes('LPM')
              )
            })
            .sort((a, b) => {
              return (
                LPMMenu.findIndex(item => item === a.title) -
                LPMMenu.findIndex(item => item === b.title)
              )
            })
          setSortedMenu(lpmMenu)
          break
        case 'PRO':
          const proMenus = HorizontalNavItems()
            .filter(value => {
              return (
                PROMenu.includes(value.title) && value.role?.includes('PRO')
              )
            })
            .sort((a, b) => {
              return (
                PROMenu.findIndex(item => item === a.title) -
                PROMenu.findIndex(item => item === b.title)
              )
            })
          setSortedMenu(proMenus)
          break
        case 'CLIENT':
          const clientMenu = HorizontalNavItems()
            .filter(value => {
              return (
                CLIENTMenu.includes(value.title) &&
                value.role?.includes('CLIENT')
              )
            })
            .sort((a, b) => {
              return (
                CLIENTMenu.findIndex(item => item === a.title) -
                CLIENTMenu.findIndex(item => item === b.title)
              )
            })
          setSortedMenu(clientMenu)
          break
        case 'ACCOUNT_MANAGER':
          const accountMenu = HorizontalNavItems().filter(value => {
            return (
              LPMMenu.includes(value.title) &&
              value.role?.includes('ACCOUNT_MANAGER')
            )
          })
          setSortedMenu(accountMenu)
          break

        default:
          setSortedMenu([])
      }
    }
  }, [permission, currentRoleState])
  return (
    <>
      {isError ? (
        <ErrorServerMaintenance />
      ) : publicPage ? (
        <Layout
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          contentHeightFixed={contentHeightFixed}
          verticalLayoutProps={{
            navMenu: {
              navItems: VerticalNavItems(),

              // Uncomment the below line when using server-side menu in vertical layout and comment the above line
              // navItems: verticalMenuItems
            },
          }}
          horizontalLayoutProps={{
            navMenu: {
              navItems: HorizontalNavItems().filter(value => {
                return (
                  PROMenu.includes(value.title) && value.role?.includes('PRO')
                )
              }),
            },
            appBar: {
              content: () => (
                <HorizontalAppBarContent
                  hidden={hidden}
                  settings={settings}
                  saveSettings={saveSettings}
                  publicPage={true}
                />
              ),
            },
          }}
        >
          {children}
        </Layout>
      ) : (
        <>
          {currentRole && permission.state === 'hasValue' && (
            <Layout
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              contentHeightFixed={contentHeightFixed}
              verticalLayoutProps={{
                navMenu: {
                  navItems: VerticalNavItems(),

                  // Uncomment the below line when using server-side menu in vertical layout and comment the above line
                  // navItems: verticalMenuItems
                },
                appBar: {
                  content: props => (
                    <VerticalAppBarContent
                      hidden={hidden}
                      settings={settings}
                      saveSettings={saveSettings}
                      toggleNavVisibility={props.toggleNavVisibility}
                    />
                  ),
                },
              }}
              horizontalLayoutProps={{
                navMenu: {
                  navItems: sortedMenu,
                },
                appBar: {
                  content: () => (
                    <HorizontalAppBarContent
                      hidden={hidden}
                      settings={settings}
                      saveSettings={saveSettings}
                    />
                  ),
                },
              }}

              // {...(settings.layout === 'horizontal' && {
              //   horizontalLayoutProps: {
              // navMenu: {
              //   navItems: HorizontalNavItems(),

              //   // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
              //   // navItems: horizontalMenuItems
              // },
              //   appBar: {
              //     content: () => (
              //       <HorizontalAppBarContent
              //         hidden={hidden}
              //         settings={settings}
              //         saveSettings={saveSettings}
              //       />
              //     ),
              //   },
              // },
              // })}
            >
              {children}
            </Layout>
          )}
        </>
      )}
    </>
  )
}

export default UserLayout
