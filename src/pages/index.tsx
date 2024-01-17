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
import { useRecoilValueLoadable } from 'recoil'
import { currentRoleSelector } from '@src/states/permission'

const Home = () => {
  const router = useRouter()
  const { contents: role, state: roleFetchState } =
    useRecoilValueLoadable(currentRoleSelector)

  useEffect(() => {
    //'CLIENT' | 'PRO' | 'LPM' | 'TAD' | 'ACCOUNT_MANAGER'
    if (role.name === 'TAD') {
      router.replace('/dashboards/tad')
      return
    }

    if (role.name === 'LPM') {
      router.replace('/dashboards/lpm')
      return
    }

    if (role.name === 'ACCOUNT_MANAGER') {
      router.replace('/dashboards/account')
      return
    }

    if (role.name === 'PRO') {
      router.replace('/dashboards/pro')
      return
    }

    router.replace('/dashboards/client')
  }, [role])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home

Home.acl = {
  subject: 'all',
  can: 'all',
}
