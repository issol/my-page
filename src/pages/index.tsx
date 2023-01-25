// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

// export const getHomeRoute = (role: Array<RoleType>) => {
//   return `/${role[0]?.toLowerCase()}/dashboard`
// }

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (auth.user && auth.user.role) {
  //     const homeRoute = getHomeRoute(auth.user.role)
  //     router.push(homeRoute)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
