// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import

import { getUserDataFromBrowser } from 'src/shared/auth/storage'
import { useRecoilValue } from 'recoil'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (getUserDataFromBrowser()) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  return <>{children}</>
}

export default GuestGuard
