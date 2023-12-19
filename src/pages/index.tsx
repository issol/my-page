// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports

import UserLayout from '@src/layouts/UserLayout'
import { useAppSelector } from '@src/hooks/useRedux'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { setAllTimeZoneList } from '@src/shared/helpers/timezone.helper'

const Home = () => {
  // ** Hooks

  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setAllTimeZoneList()
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home

Home.acl = {
  subject: 'all',
  can: 'all',
}
