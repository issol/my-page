import { ReactNode, useEffect, useCallback } from 'react'
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValueLoadable,
} from 'recoil'

import {
  getUserDataFromBrowser,
  getUserTokenFromBrowser,
  removeUserDataFromBrowser,
  getRedirectPath,
  removeRedirectPath,
  getCompanyDataFromBrowser,
  removeCompanyDataFromBrowser,
  setRedirectPath,
} from '@src/shared/auth/storage'

import { useGetClientUserInfo } from '@src/queries/common.query'

import { UserDataType, UserRoleType, ClientUserType } from '../../context/types'

import { useRouter } from 'next/router'
import { authState } from '@src/states/auth'
import {
  currentRoleSelector,
  permissionSelector,
  roleSelector,
  timezoneSelector,
} from '@src/states/permission'
import { setAllTimeZoneList } from '../helpers/timezone.helper'

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const router = useRouter()
  const [auth, setAuth] = useRecoilStateLoadable<{
    user: UserDataType | null
    company: ClientUserType | undefined | null
    loading: boolean
  }>(authState)

  const [permission, setPermission] = useRecoilStateLoadable(permissionSelector)
  const [roles, setRoles] = useRecoilStateLoadable(roleSelector)
  const [currentRole, setCurrentRole] =
    useRecoilStateLoadable(currentRoleSelector)
  const [timezone, setTimezone] = useRecoilStateLoadable(timezoneSelector)

  const { data: companyData, refetch } = useGetClientUserInfo()

  useEffect(() => {
    if (router.isReady) {
      setAllTimeZoneList(setTimezone)
    } else {
      return
    }
  }, [router])

  const hasTadAndLpm = useCallback((role: UserRoleType[]): boolean => {
    return (
      role.some(value => value.name === 'TAD') &&
      role.some(value => value.name === 'LPM')
    )
  }, [])

  const handleSetCurrentRole = useCallback(() => {
    console.log(router.pathname)

    if (
      auth.state === 'hasValue' &&
      roles.state === 'hasValue' &&
      roles.getValue() &&
      currentRole.state === 'hasValue' &&
      permission.state === 'hasValue'
    ) {
      setPermission(permission.getValue())
      setRoles(roles.getValue())
      const roleNames = roles.getValue().map(item => item.name)

      const redirectPath = getRedirectPath()
      console.log(redirectPath)

      const storageRole = currentRole.getValue()
      if (!storageRole) {
        const TADRole =
          hasTadAndLpm(roles.getValue()) &&
          roles.getValue().find(item => item.name === 'TAD')

        TADRole ? setCurrentRole(TADRole) : setCurrentRole(roles.getValue()[0])
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

      const isPro = roleNames.includes('PRO')
      const isManager = roleNames.includes('TAD') || roleNames.includes('LPM')

      if (!isClient) {
        if (isPro) {
          if (
            auth.getValue().user?.firstName &&
            auth.getValue().user?.firstName != ''
          ) {
            return
          } else {
            router.replace('/welcome/pro')
          }
        } else if (isManager) {
          if (
            auth.getValue().user?.firstName &&
            auth.getValue().user?.firstName != ''
          ) {
            if (redirectPath) {
              router.replace(redirectPath)
              removeRedirectPath()
            }
            return
          } else {
            router.replace('/welcome/manager')
          }
        }
        return
      } else if (isClient) {
        const isClientGeneral =
          roles.getValue().find(i => i.name === 'CLIENT')?.type === 'General'
        if (
          auth.getValue().company === undefined ||
          !auth.getValue().company?.clientId
        ) {
          router.replace('/signup/finish/client')
        } else if (isClientGeneral && !auth.getValue().user?.firstName) {
          router.replace('/welcome/client/add-new/general-client')
        } else if (!auth.getValue().user?.firstName) {
          router.replace('/company/my-account')
        }
        return
      } else if (redirectPath) {
        router.replace(redirectPath)
        removeRedirectPath()
        // return
      } else if (router.pathname === '/') {
        router.push(`/dashboards`)
      }
    }
  }, [auth, roles, permission])

  useEffect(() => {
    if (companyData) {
      setAuth(prev => ({ ...prev, company: companyData }))
    }
  }, [])

  useEffect(() => {
    handleSetCurrentRole()
  }, [handleSetCurrentRole])

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      router.pathname === '/' && router.replace('/login')

      const storedToken = getUserTokenFromBrowser()!

      if (storedToken) {
        console.log(storedToken)

        setAuth(prev => ({ ...prev, loading: true }))
        const browserUserData = getUserDataFromBrowser()
        const browserCompanyData = getCompanyDataFromBrowser()

        setAuth(prev => ({
          ...prev,
          user: JSON?.parse(browserUserData || '{}'),
          company: JSON?.parse(browserCompanyData || '{}'),
        }))
        setAuth(prev => ({ ...prev, loading: false }))
      } else {
        const parsePath = () => {
          if (router.asPath.includes('[id]')) {
            const { id } = router.query
            return `${router.asPath.replace('[id]', '')}${id}`
          }
          return null
        }

        console.log(parsePath())
        parsePath() !== null && setRedirectPath(parsePath()!)
        removeUserDataFromBrowser()
        removeCompanyDataFromBrowser()
        setAuth(prev => ({ ...prev, loading: false }))
      }
    }

    initAuth()
  }, [])

  return <>{children}</>
}

export default AuthProvider
