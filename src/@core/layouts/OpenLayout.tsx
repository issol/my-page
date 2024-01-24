import { ReactNode, useEffect, useState } from 'react'
import Layout from './Layout'
import { useSettings } from '../hooks/useSettings'
import VerticalNavItems from '@src/navigation/vertical'
import HorizontalNavItems from '@src/navigation/horizontal'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { HorizontalNavItemsType } from './types'
import { PROMenu } from '@src/shared/const/menu/menu'
import HorizontalAppBarContent from '@src/layouts/components/horizontal/AppBarContent'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const OpenLayout = ({ children, contentHeightFixed }: Props) => {
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const [sortedMenu, setSortedMenu] = useState<HorizontalNavItemsType>([])

  useEffect(() => {
    setSortedMenu(
      HorizontalNavItems().filter(value => {
        return PROMenu.includes(value.title) && value.role?.includes('PRO')
      }),
    )
  }, [])
  return (
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
        // appBar: {
        //   content: props => (
        //     <VerticalAppBarContent
        //       hidden={hidden}
        //       settings={settings}
        //       saveSettings={saveSettings}
        //       toggleNavVisibility={props.toggleNavVisibility}
        //     />
        //   ),
        // },
      }}
      horizontalLayoutProps={{
        navMenu: {
          navItems: HorizontalNavItems().filter(value => {
            return PROMenu.includes(value.title) && value.role?.includes('PRO')
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
  )
}

export default OpenLayout
