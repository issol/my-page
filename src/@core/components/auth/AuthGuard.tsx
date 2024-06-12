// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import

import {
  getUserDataFromBrowser,
  saveUserDataToBrowser,
  saveUserTokenToBrowser,
  setRedirectPath,
} from '@src/shared/auth/storage'

import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { UserDataType } from '@src/context/types'
import { currentRoleSelector } from '@src/states/permission'
import { getCookie } from 'cookies-next'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const [auth, setAuth] = useRecoilStateLoadable(authState)
  const [currentRole, setCurrentRole] =
    useRecoilStateLoadable(currentRoleSelector)
  const router = useRouter()

  const companyName = getCookie('companyName')

  useEffect(
    () => {
      // ! query가 붙은 경로에 로그인 하지 않은 유저가 접근했을 경우 무한 fallback이 보여지는 문제로 주석처리
      // if (!router.isReady) {
      //   return
      // }

      if (
        auth.state === 'hasValue' &&
        auth.getValue().user === null &&
        !getUserDataFromBrowser()
      ) {
        if (router.query.accessToken) {
          console.log(router.query)
          const accessToken = router.query.accessToken as string
          const userData = JSON?.parse(router.query.userData as string)
          const currentRole = JSON?.parse(router.query.currentRole as string)
          saveUserTokenToBrowser(accessToken)
          saveUserDataToBrowser(userData as UserDataType)
          setCurrentRole(currentRole)

          setAuth(prev => ({ ...prev, loading: true }))
          setAuth(prev => ({
            ...prev,
            user: userData,
          }))
          setAuth(prev => ({ ...prev, loading: false }))
          const parsePath = router.asPath.split('?')
          router.push(parsePath[0])
          setRedirectPath(parsePath[0])
          return
        } else {
          if (companyName) {
            router.push(`/${companyName}/login`)
          } else {
            router.push('/login')
          }
        }

        // if (router.asPath !== '/' || router.asPath !== `/${companyName}/`) {
        //   router.push('/login')
        // } else {
        //   // router.replace('/login')
        // }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route],
  )

  useEffect(() => {
    if (
      auth.state === 'hasValue' &&
      auth.getValue().user === null &&
      !getUserDataFromBrowser()
    ) {
      if (router.asPath !== '/') {
        const parsePath = () => {
          if (router.asPath.includes('[id]')) {
            const { id } = router.query
            return `${router.asPath.replace('[id]', '')}${id}`
          }
          return router.asPath
        }
        setRedirectPath(parsePath())
      }
    }
  }, [router.query])

  if (
    auth.state === 'loading' ||
    auth.getValue().loading ||
    auth.getValue().user === null
  ) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
