import { ReactNode, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import {
  getUserDataFromBrowser,
  getUserTokenFromBrowser,
  removeUserDataFromBrowser,
  getRedirectPath,
  removeRedirectPath,
  getCurrentRole,
  setCurrentRole,
} from 'src/shared/auth/storage'
import { getPermission, getRole } from 'src/store/permission'
import { useAppDispatch } from 'src/hooks/useRedux'
import { useAppSelector } from 'src/hooks/useRedux'
import { useGetClientUserInfo } from '@src/queries/common.query'

import { UserDataType, UserRoleType, ClientUserType } from '../../context/types'

import { useRouter } from 'next/router'
import { authState } from '@src/states/auth'

type Props = {
  children: ReactNode
}
const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useRecoilState<{
    user: UserDataType | null
    company: ClientUserType | undefined | null
    loading: boolean
  }>(authState)
  const [fetchClient, setFetchClient] = useState(false)
  const { data: companyData } = useGetClientUserInfo(fetchClient)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const userAccess = useAppSelector(state => state.userAccess)

  function hasTadAndLpm(role: UserRoleType[]): boolean {
    return (
      role.some(value => value.name === 'TAD') &&
      role.some(value => value.name === 'LPM')
    )
  }

  useEffect(() => {
    if (auth.user) {
      dispatch(getRole(auth.user.id)).then(res => {
        const isClient = res.payload.roles
          ?.map((i: { name: string }) => i.name)
          .includes('CLIENT')
        setFetchClient(isClient)
      })
      dispatch(getPermission())
    }
  }, [auth.user])

  useEffect(() => {
    if (companyData) {
      setAuth(prev => ({ ...prev, company: companyData }))
    }
  }, [companyData])

  useEffect(() => {
    if (auth.user && userAccess.role.length) {
      const roles = userAccess.role.map(item => item.name)

      const redirectPath = getRedirectPath()
      const storageRole = getCurrentRole()
      if (!storageRole) {
        const TADRole =
          hasTadAndLpm(userAccess.role) &&
          userAccess.role.find(item => item.name === 'TAD')
        TADRole ? setCurrentRole(TADRole) : setCurrentRole(userAccess.role[0])
      } else {
        const findRole = userAccess.role.find(
          item => item.name === storageRole.name,
        )
        if (findRole && storageRole.type !== findRole?.type)
          setCurrentRole(findRole)
        else setCurrentRole(userAccess.role[0])
      }

      const isClient = roles?.includes('CLIENT')
      const isProUpdatedProfile = roles?.includes('PRO') && auth.user?.firstName
      const isManagerUpdatedProfile =
        (roles?.includes('TAD') || roles?.includes('LPM')) &&
        auth.user?.firstName

      if (!isClient) {
        if (!isProUpdatedProfile) {
          router.replace('/welcome/pro')
        } else if (!isManagerUpdatedProfile) {
          router.replace('/welcome/manager')
        }
        return
      } else if (isClient && auth.company !== undefined) {
        const isClientGeneral =
          userAccess.role.find(i => i.name === 'CLIENT')?.type === 'General'
        if (!auth.company?.name) {
          router.replace('/signup/finish/client')
        } else if (isClientGeneral && !auth.user.firstName) {
          router.replace('/welcome/client/add-new/general-client')
        }
        return
      } else if (redirectPath) {
        router.replace(redirectPath)
        removeRedirectPath()
        return
      } else if (router.pathname === '/') {
        router.push(`/home`)
      }
    }
  }, [userAccess.role, auth.user, auth.company])

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      router.pathname === '/' && router.replace('/login')

      const storedToken = getUserTokenFromBrowser()!

      if (storedToken) {
        setAuth(prev => ({ ...prev, loading: true }))
        getUserDataFromBrowser() &&
          setAuth(prev => ({
            ...prev,
            user: JSON?.parse(getUserDataFromBrowser() || ''),
          }))
        setAuth(prev => ({ ...prev, loading: false }))
      } else {
        removeUserDataFromBrowser()
        setAuth(prev => ({ ...prev, loading: false }))
      }
    }

    initAuth()
  }, [])

  return <>{children}</>
}

export default AuthProvider
