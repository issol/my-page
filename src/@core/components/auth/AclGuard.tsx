// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'

/* redux */
import { useAppSelector } from 'src/hooks/useRedux'
import FallbackSpinner from '../spinner'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)

  const { permission, isLoading } = useAppSelector(state => state.userAccess)

  // ** Hooks
  const router = useRouter()

  // User is logged in, build ability for the user based on his role
  useEffect(() => {
    setAbility(buildAbilityFor(permission))
  }, [permission])

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (
    guestGuard ||
    router.route === '/404' ||
    router.route === '/500' ||
    router.route === '/'
  ) {
    return <>{children}</>
  }
  // Check the access of current user and render pages

  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    )
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      {!permission.length || isLoading || !ability ? (
        <FallbackSpinner />
      ) : (
        <NotAuthorized />
      )}
      {/* <FallbackSpinner /> */}
    </BlankLayout>
  )
}

export default AclGuard
