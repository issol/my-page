import { useRecoilValueLoadable } from 'recoil'
import { currentRoleSelector } from '@src/states/permission'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@src/@core/components/spinner'

const Dashboards = () => {
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

// Dashboards.acl = {
//   action: 'read',
//   subject: 'client',
// }

export default Dashboards
Dashboards.guestGuard = true