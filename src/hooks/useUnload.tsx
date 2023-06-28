import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Box, Button, Dialog, Typography } from '@mui/material'
import { SmallModalContainer } from '@src/@core/components/modal'
import AlertIcon from '@src/@core/components/alert-icon'

export const useConfirmLeave = ({
  shouldWarn,
  toUrl,
}: {
  shouldWarn: boolean
  toUrl: string
}) => {
  const router = useRouter()
  const [hasConfirmed, setHasConfirmed] = useState(false)

  const [navigationConfig, setNavigationConfig] = useState<{
    nextRoute: string | null
    isModalOpen: boolean
  }>({
    nextRoute: null,
    isModalOpen: false,
  })

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!shouldWarn) return

      e.preventDefault()
      const event = e || window.event

      return (event.returnValue =
        'Are you sure you want to leave this page? Changes you made may not be saved.')
    }

    window.addEventListener('beforeunload', handleWindowClose)

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
    }
  }, [shouldWarn])

  useEffect(() => {
    const onRouteChangeStart = (route: string) => {
      // if (!shouldWarn || hasConfirmed) return

      if (
        decodeURI(router.asPath).split('?')[0] !==
          decodeURI(route).split('?')[0] &&
        shouldWarn &&
        !hasConfirmed
      ) {
        setNavigationConfig({
          nextRoute: toUrl,
          isModalOpen: true,
        })
        router.events.emit('routeChangeError')
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 'navigation aborted'
      }
    }
    router.events.on('routeChangeStart', onRouteChangeStart)
    const cleanUp = () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
    }

    if (hasConfirmed) {
      if (!navigationConfig.nextRoute) return
      router.push(navigationConfig.nextRoute)
      return cleanUp
    }

    return cleanUp
  }, [navigationConfig, hasConfirmed, router, shouldWarn])

  const ConfirmLeaveModal = () => (
    <Dialog open={navigationConfig.isModalOpen} maxWidth='lg'>
      <SmallModalContainer style={{ minWidth: '440px' }}>
        <AlertIcon type='error' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          Are you sure you want to leave this page? Changes you made may not be
          saved.
        </Typography>

        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button
            variant='outlined'
            onClick={() => {
              router.push(router.asPath)
              {
                setNavigationConfig({
                  nextRoute: null,
                  isModalOpen: false,
                })
              }
            }}
          >
            Stay on this page
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setHasConfirmed(true)
            }}
          >
            Leave this page
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )

  return {
    ConfirmLeaveModal,
  }
}
