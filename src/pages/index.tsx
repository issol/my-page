// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import { RoleType } from 'src/types/apps/userTypes'

/**
 *  TODO: role 별 homeroute 정하기
 */
export const getHomeRoute = (role: Array<RoleType>) => {
  // if (role === 'client') return '/acl'
  // else return `/${role.toLowerCase()}/dashboard`
  return `/${role[0]?.toLowerCase()}/dashboard`
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)
      // Redirect user to Home URL
      router.push(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
