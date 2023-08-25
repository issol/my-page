import { ReactNode, useEffect, useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  getUserDataFromBrowser,
  getUserTokenFromBrowser,
  removeUserDataFromBrowser,
  getRedirectPath,
  removeRedirectPath,
} from 'src/shared/auth/storage'

import { useGetClientUserInfo } from '@src/queries/common.query'

import { UserDataType, UserRoleType, ClientUserType } from '../../context/types'

import { useRouter } from 'next/router'
import { authState } from '@src/states/auth'
import {
  currentRoleSelector,
  permissionSelector,
  roleSelector,
} from '@src/states/permission'

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useRecoilState<{
    user: UserDataType | null
    company: ClientUserType | undefined | null
    loading: boolean
  }>(authState)

  const permission = useRecoilValue(permissionSelector)
  const [roles, setRoles] = useRecoilState(roleSelector)
  const [currentRole, setCurrentRole] = useRecoilState(currentRoleSelector)

  const { data: companyData, refetch } = useGetClientUserInfo()

  const router = useRouter()

  const hasTadAndLpm = useCallback((role: UserRoleType[]): boolean => {
    return (
      role.some(value => value.name === 'TAD') &&
      role.some(value => value.name === 'LPM')
    )
  }, [])

  const handleSetCurrentRole = useCallback(() => {
    if (auth.user && roles.length) {
      setRoles(roles)
      const roleNames = roles.map(item => item.name)

      const redirectPath = getRedirectPath()
      const storageRole = currentRole

      console.log(currentRole)

      if (!storageRole) {
        const TADRole =
          hasTadAndLpm(roles) && roles.find(item => item.name === 'TAD')

        console.log(TADRole)
        console.log(roles[0])

        TADRole ? setCurrentRole(TADRole) : setCurrentRole(roles[0])
      } else {
        // const findRole = roles.find(item => item.name === storageRole.name)
        // console.log(findRole)

        // if (findRole && storageRole.type !== findRole?.type)
        //   setCurrentRole(findRole)
        // else setCurrentRole(roles[0])
        setCurrentRole(storageRole)
      }

      const isClient = roleNames?.includes('CLIENT')
      isClient && refetch()
      const isProUpdatedProfile =
        roleNames?.includes('PRO') && auth.user?.firstName
      const isManagerUpdatedProfile =
        (roleNames?.includes('TAD') || roleNames?.includes('LPM')) &&
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
          roles.find(i => i.name === 'CLIENT')?.type === 'General'
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
  }, [auth.user, roles, auth.company, hasTadAndLpm, router, refetch])

  useEffect(() => {
    if (companyData) {
      setAuth(prev => ({ ...prev, company: companyData }))
    }
  }, [companyData])

  useEffect(() => {
    handleSetCurrentRole()
  }, [handleSetCurrentRole])

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
