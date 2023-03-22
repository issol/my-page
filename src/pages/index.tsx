// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import UserLayout from '@src/layouts/UserLayout'
import { useAppSelector } from '@src/hooks/useRedux'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const { permission, isLoading } = useAppSelector(state => state.userAccess)
  console.log('permission : ', permission)

  useEffect(() => {
    router.replace('/home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home

Home.acl = {
  subject: 'all',
  can: 'all',
}
