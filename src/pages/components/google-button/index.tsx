import { useEffect, useRef } from 'react'

// ** NextJs
import Script from 'next/script'
import { useRouter } from 'next/router'

// ** styles
import styled from 'styled-components'

// ** context

// ** hooks
import useModal from '@src/hooks/useModal'

// ** modals
import SignupNotApprovalModal from '@src/pages/components/modals/confirm-modals/signup-not-approval-modal'
import MoveSignupModal from '@src/pages/components/modals/confirm-save-modals/move-signup-modal'
import ServerErrorModal from '@src/pages/components/modals/confirm-modals/server-error-modal'

// ** fetch
import { useMutation } from 'react-query'
import { saveUserTokenToBrowser } from 'src/shared/auth/storage'
import { googleAuth } from 'src/apis/sign.api'

// ** third party
import jwt_decode from 'jwt-decode'
import { toast } from 'react-hot-toast'
import logger from '@src/@core/utils/logger'
import useAuth from '@src/hooks/useAuth'

export default function GoogleButton() {
  const router = useRouter()
  const emailRef = useRef('')

  // ** Hooks
  const auth = useAuth()
  const { openModal, closeModal } = useModal()

  useEffect(() => {
    generateGoogleLoginButton()
  }, [router])

  const googleMutation = useMutation(
    (credential: string) => googleAuth(credential),
    {
      onSuccess: res => {
        logger.info('google auth success res : ', res)
        if (!res.accessToken) {
          openModal({
            type: 'signup-not-approval-modal',
            children: (
              <SignupNotApprovalModal
                onClose={() => closeModal('signup-not-approval-modal')}
              />
            ),
          })
        } else {
          auth.updateUserInfo(res)
          router.replace('/')
        }
      },
      onError: err => {
        logger.debug('Fail Google login', err)
        if (err === 'NOT_A_MEMBER') {
          openModal({
            type: 'move-signup-modal',
            children: (
              <MoveSignupModal
                onClose={() => closeModal('move-signup-modal')}
                onConfirm={() =>
                  router.replace(
                    {
                      pathname: '/signup/',
                      query: { email: emailRef.current },
                    },
                    '/signup/',
                  )
                }
              />
            ),
          })
        } else if (err === 'SERVER_ERROR') {
          openModal({
            type: 'server-error-modal',
            children: (
              <ServerErrorModal
                onClose={() => closeModal('server-error-modal')}
              />
            ),
          })
        } else {
          toast.error('Something went wrong. Please try again.', {
            position: 'bottom-left',
          })
        }
      },
    },
  )

  function handleCredentialResponse(response: { credential?: string }) {
    if (response.credential) {
      //@ts-ignore
      const email = jwt_decode(response.credential)?.email as string
      emailRef.current = email
      googleMutation.mutate(response.credential)
    }
  }

  function generateGoogleLoginButton() {
    window?.google?.accounts?.id?.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    })
    //** 이거 활성화 하면 화면 오른쪽 상단에 구글 로그인이 보여짐 */
    // window?.google?.accounts?.id.prompt();
    window?.google?.accounts?.id.renderButton(
      document.getElementById('buttonDiv'),
      {
        theme: 'outline',
        width: 450,
        background: 'transparent',
      },
    )
  }
  return (
    <>
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='afterInteractive'
        onLoad={generateGoogleLoginButton}
        onReady={generateGoogleLoginButton}
      />
      <GoogleButtonWrapper>
        <div id='buttonDiv' data-type="icon"></div>
      </GoogleButtonWrapper>
    </>
  )
}

const GoogleButtonWrapper = styled.div`
  position: absolute;
  opacity: 0.0001 !important;
`
