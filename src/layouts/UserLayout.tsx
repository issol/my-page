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
import { getCurrentRole } from 'src/shared/auth/storage'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'
import { useRecoilValueLoadable } from 'recoil'
import { currentRoleSelector, permissionState } from '@src/states/permission'
import { current } from '@reduxjs/toolkit'
import { HorizontalNavItemsType } from '@src/@core/layouts/types'
import { UserRoleType } from '@src/context/types'
interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()

  // const { currentRole } = useAppSelector(state => state.userAccess)
  const currentRoleStorage = getCurrentRole()

  const currentRoleState = useRecoilValueLoadable(currentRoleSelector)
  const permission = useRecoilValueLoadable(permissionState)
  const [sortedMenu, setSortedMenu] = useState<HorizontalNavItemsType>([])

  const [currentRole, setCurrentRole] = useState<UserRoleType | null>(null)

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  console.log(currentRoleState)

  useEffect(() => {
    const current =
      currentRoleState.state === 'hasValue'
        ? currentRoleState.getValue()
        : currentRoleStorage
        ? currentRoleStorage
        : null

    console.log(currentRoleStorage)

    console.log(currentRoleState.getValue())

    setCurrentRole(current)
    // console.log(current)

    console.log(
      HorizontalNavItems().filter(value => PROMenu.includes(value.title)),
    )

    if (permission.state === 'hasValue' && current) {
      switch (current.name) {
        case 'TAD':
          setSortedMenu(
            HorizontalNavItems().filter(value => TADMenu.includes(value.title)),
          )
          break
        case 'LPM':
          setSortedMenu(
            HorizontalNavItems().filter(value => LPMMenu.includes(value.title)),
          )
          break
        case 'PRO':
          setSortedMenu(
            HorizontalNavItems().filter(value => PROMenu.includes(value.title)),
          )
          break
        case 'CLIENT':
          setSortedMenu(
            HorizontalNavItems().filter(value =>
              CLIENTMenu.includes(value.title),
            ),
          )
          break
        default:
          setSortedMenu([])
      }
    }
  }, [permission, currentRoleState])
  return (
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
  )
}

export default UserLayout
