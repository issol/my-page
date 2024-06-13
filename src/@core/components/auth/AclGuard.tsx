// ** React Imports
import { ReactNode, Suspense, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from '@src/configs/acl'

// ** Context Imports
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from '@src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from '@src/@core/layouts/BlankLayout'

/* redux */

import FallbackSpinner from '../spinner'
import { permissionState } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'
import { getCookie } from 'cookies-next'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props
  const companyName = getCookie('companyName')

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)

  const permission = useRecoilValueLoadable(permissionState)
  const [permissionCheck, setPermissionCheck] = useState(false)
  // ** Hooks
  const router = useRouter()

  const checkAbility =
    ability !== undefined &&
    ability?.can(aclAbilities.action, aclAbilities.subject)

  // User is logged in, build ability for the user based on his role
  useEffect(() => {
    if (permission.state === 'hasValue') {
      permission.getValue().length > 1 &&
        setAbility(buildAbilityFor(permission.getValue()))

      setPermissionCheck(true)
    }
  }, [permission])

  // If guestGuard is true or it's an error page or home page, render the page without checking access
  if (guestGuard || ['/404', '/500', '/'].includes(router.route)) {
    return <>{children}</>
  }

  // // If user has the required ability, render the page
  // if (ability?.can(aclAbilities.action, aclAbilities.subject)) {
  //   return (
  //     <AbilityContext.Provider value={ability}>
  //       {children}
  //     </AbilityContext.Provider>
  //   )
  // }

  // // If permission check is complete and user does not have the required ability, render NotAuthorized
  // if (
  //   permissionCheck &&
  //   ability !== undefined &&
  //   !ability.can(aclAbilities.action, aclAbilities.subject)
  // ) {
  //   return (
  //     <BlankLayout>
  //       <NotAuthorized />
  //     </BlankLayout>
  //   )
  // }

  // // While permission check is in progress, render a spinner
  // return (
  //   <BlankLayout>
  //     <FallbackSpinner />
  //   </BlankLayout>
  // )

  return (
    <>
      {/* {guestGuard || (['/404', '/500', '/'].includes(router.route) && children)} */}
      {!Boolean(permissionCheck) ||
      ability === undefined ||
      checkAbility === undefined ? (
        <FallbackSpinner />
      ) : checkAbility || router.asPath === `/${companyName}/` ? (
        <AbilityContext.Provider value={ability}>
          {children}
        </AbilityContext.Provider>
      ) : (
        <BlankLayout>
          <NotAuthorized />
        </BlankLayout>
      )}
    </>
  )

  // return (
  //   // <Suspense fallback={<FallbackSpinner />}>
  //   <>
  //     {permissionCheck && (
  //       <BlankLayout>
  //         {permission.getValue() === undefined || !ability ? (
  //           <FallbackSpinner />
  //         ) : (
  //           <NotAuthorized />
  //         )}
  //       </BlankLayout>
  //     )}
  //   </>

  //   // </Suspense>
  // )

  // Render Not Authorized component if the current user has limited access
  // return (
  //   <BlankLayout>
  //   {permission.state === 'loading' ? (
  //     <FallbackSpinner />
  //   ) : !permission.getValue().length || !ability ? (
  //     <NotAuthorized />
  //   ) : (
  //     children
  //   )}
  // </BlankLayout>
  // )
}

export default AclGuard
