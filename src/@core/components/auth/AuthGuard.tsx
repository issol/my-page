// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { getUserDataFromBrowser } from 'src/shared/auth/storage'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      // ! query가 붙은 경로에 로그인 하지 않은 유저가 접근했을 경우 무한 fallback이 보여지는 문제로 주석처리
      // if (!router.isReady) {
      //   return
      // }

      if (auth.user === null && !getUserDataFromBrowser()) {
        if (router.asPath !== '/') {
          router.push('/login')
        } else {
          // router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route],
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
