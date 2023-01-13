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
import { useAuth } from 'src/hooks/useAuth'
import { Button } from '@mui/material'
import { RoleType } from 'src/types/apps/userTypes'
import { useRouter } from 'next/router'
import { ACLObj, AppAbility, buildAbilityFor } from 'src/configs/acl'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

export const TadPermission = [
  'account-create',
  'AC0010',
  'account-update',
  'account-delete',
  'certificationTest-create',
  'TE0650',
  'certificationTest-update',
  'certificationTest-delete',
  'certificationTestMaterials-create',
  'certificationTestMaterials-read',
  'certificationTestMaterials-update',
  'certificationTestMaterials-delete',
  'company-create',
  'L8870',
  'company-update',
  'company-delete',
  'dashboard-create',
  'B1072',
  'dashboard-update',
  'dashboard-delete',
  'email-create',
  'MB0333',
  'email-update',
  'email-delete',
  'onboarding-create',
  'LH4465',
  'onboarding-update',
  'onboarding-delete',
  'onboardingList-create',
  'onboardingList-read',
  'onboardingList-update',
  'onboardingList-delete',
  'recruiting-create',
  'PH2323',
  'recruiting-update',
  'recruiting-delete',
  'jobPosting-create',
  'jobPosting-read',
  'jobPosting-update',
  'jobPosting-delete',
  'recruitingCreate-create',
  'recruitingCreate-read',
  'recruitingCreate-update',
  'recruitingCreate-delete',
  'recruitingList-create',
  'recruitingList-read',
  'recruitingList-update',
  'recruitingList-delete',
]

export const LpmPermission = [
  'account-create',
  'AC0010',
  'account-update',
  'account-delete',
  'clients-create',
  'BU7644',
  'clients-update',
  'clients-delete',
  'clientCreate-create',
  'clientCreate-read',
  'clientCreate-update',
  'clientCreate-delete',
  'clientList-create',
  'clientList-read',
  'clientList-update',
  'clientList-delete',
  'company-create',
  'L8870',
  'company-update',
  'company-delete',
  'dashboard-create',
  'B1072',
  'dashboard-update',
  'dashboard-delete',
  'email-create',
  'MB0333',
  'email-update',
  'email-delete',
  'invoices-create',
  'EV6630',
  'invoices-update',
  'invoices-delete',
  'clientInvoiceCreate-create',
  'clientInvoiceCreate-read',
  'clientInvoiceCreate-update',
  'clientInvoiceCreate-delete',
  'clientInvoiceList-create',
  'clientInvoiceList-read',
  'clientInvoiceList-update',
  'clientInvoiceList-delete',
  'proInvoiceCreate-create',
  'proInvoiceCreate-read',
  'proInvoiceCreate-update',
  'proInvoiceCreate-delete',
  'proInvoiceList-create',
  'proInvoiceList-read',
  'proInvoiceList-update',
  'proInvoiceList-delete',
  'orders-create',
  'NO2001',
  'orders-update',
  'orders-delete',
  'orderCreate-create',
  'orderCreate-read',
  'orderCreate-update',
  'orderCreate-delete',
  'orderList-create',
  'orderList-read',
  'orderList-update',
  'orderList-delete',
  'pros-create',
  'BU5945',
  'pros-update',
  'pros-delete',
  'proCreate-create',
  'proCreate-read',
  'proCreate-update',
  'proCreate-delete',
  'proList-create',
  'proList-read',
  'proList-update',
  'proList-delete',
  'quotes-create',
  'PO5800',
  'quotes-update',
  'quotes-delete',
  'quoteCreate-create',
  'quoteCreate-read',
  'quoteCreate-update',
  'quoteCreate-delete',
  'quoteList-create',
  'quoteList-read',
  'quoteList-update',
  'quoteList-delete',
]

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  const auth = useAuth()
  const router = useRouter()
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)
  const [role, setRole] = useState<RoleType | null>(auth.user?.role[0] || null)
  const [roleBtn, setRoleBtn] = useState<ReactNode>(null)

  const handleSwitchRole = (role: RoleType | null) => {
    if (role !== null) {
      setRole(role)
      // if (auth.setUser !== null) {
      //   auth.setUser((prevState: any) => ({
      //     ...prevState,
      //     permission: role === 'TAD' ? TadPermission : LpmPermission,
      //   }))
      // }

      // setAbility(
      //   buildAbilityFor(role === 'TAD' ? TadPermission : LpmPermission, role),
      // )
    }
  }

  useEffect(() => {
    if (router.pathname !== '/') {
      router.push(`/${role?.toLowerCase()}/company`)
    }
  }, [role])

  // useEffect(() => {
  //   setRoleBtn(
  //     <div>
  //       {auth.user?.role.map((item, idx) => (
  //         <Button key={idx} onClick={() => setRole(item)}>
  //           {item}
  //         </Button>
  //       ))}
  //     </div>,
  //   )
  // }, [auth.user?.role])

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

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      roleButton={roleBtn}
      verticalLayoutProps={{
        navMenu: {
          navItems: VerticalNavItems(role),

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
              handleSwitchRole={handleSwitchRole}
              role={role}
            />
          ),
        },
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems(role),

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => (
              <HorizontalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                handleSwitchRole={handleSwitchRole}
                role={role}
              />
            ),
          },
        },
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
