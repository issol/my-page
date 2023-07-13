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
          nextRoute: route === toUrl ? toUrl : route,
          isModalOpen: true,
        })
        router.events.emit('routeChangeError', 'navigation aborted', route)
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
  }, [navigationConfig, hasConfirmed, router, shouldWarn, toUrl])

  const ConfirmLeaveModal = () => (
    <Dialog open={navigationConfig.isModalOpen} maxWidth='lg'>
      <Box
        sx={{
          maxWidth: '372px',
          width: '100%',
          background: '#ffffff',
          boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
          borderRadius: '10px',
        }}
      >
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertIcon type='error' />
            <Typography
              variant='subtitle2'
              textAlign='center'
              fontWeight={400}
              fontSize={16}
              mt='10px'
              sx={{
                lineHeight: '24px',
                letterSpacing: 0.1,
              }}
            >
              Are you sure you want to leave this page? Changes you made may not
              be saved.
            </Typography>
          </Box>

          <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
            <Button
              variant='outlined'
              onClick={() => {
                window.history.pushState('', '')
                router.push(router.asPath)
                {
                  setNavigationConfig({
                    nextRoute: null,
                    isModalOpen: false,
                  })
                }
              }}
            >
              <Typography
                fontSize={14}
                color={'#666CFF'}
                fontWeight={500}
                fontStyle={'normal'}
                letterSpacing={'0.01px'}
              >
                Stay on this page
              </Typography>
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                setHasConfirmed(true)
                setNavigationConfig(prevState => ({
                  ...prevState,
                  isModalOpen: false,
                }))
              }}
            >
              <Typography
                fontSize={14}
                color={'#FFFFFF'}
                fontWeight={500}
                fontStyle={'normal'}
                letterSpacing={'0.01px'}
              >
                Leave this page
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )

  return {
    ConfirmLeaveModal,
  }
}
