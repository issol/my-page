import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

interface UseChangeRouteBlockingProps {
  isPageChangeShowAlert?: boolean
}

/**
 * 페이지를 변경하기 전에 경고창을 띄워주는 커스텀 훅
 * @param isPageChangeShowAlert : 페이지를 변경하기 전에 경고창을 띄울지 여부
 */
const useChangeRouteBlocking = ({
  isPageChangeShowAlert,
}: UseChangeRouteBlockingProps) => {
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  const isSamePath = useCallback(
    (nextUrl: string) => {
      return router.asPath.split('?')[0] === nextUrl.split('?')[0]
    },
    [router.asPath],
  )

  const handleRouterChange = useCallback(
    (url: string) => {
      if (isSamePath(url)) {
        return
      }

      const changePage = () => {
        router.events.off('routeChangeStart', handleRouterChange)
        router.push(url)
      }

      changePageAlert(changePage)

      router.events.emit('routeChangeError')
      throw 'Not Error, Just Change Page'
    },
    [router],
  )

  /**
   * 페이지를 변경하기 전에 경고창을 띄워주는 함수
   *  @param {function} callback : 페이지를 변경하기 전에 해야할 작업이 있는 경우 callback 함수를 추가할 수 있음.
   */
  const changePageAlert = useCallback(
    (callback?: () => void) => {
      openModal({
        type: 'changePageAlert',
        children: (
          <CustomModal
            vary='error'
            title='Are you sure you want to leave this page? The information will not be saved.'
            leftButtonText='Stay on this page'
            rightButtonText='Leave this page'
            onClose={() => {
              closeModal('changePageAlert')
            }}
            onClick={() => {
              if (callback) callback()
              closeModal('changePageAlert')
            }}
          />
        ),
      })
    },
    [router, handleRouterChange],
  )

  useEffect(() => {
    if (!isPageChangeShowAlert) return
    router.events.on('routeChangeStart', handleRouterChange)
    return () => {
      router.events.off('routeChangeStart', handleRouterChange)
    }
  }, [router, router.events, handleRouterChange, isPageChangeShowAlert])

  return { changePageAlert }
}
export default useChangeRouteBlocking
