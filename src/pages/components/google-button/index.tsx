import { useEffect, useRef } from 'react'

// ** NextJs
import Script from 'next/script'
import { useRouter } from 'next/router'

// ** styles
import styled from 'styled-components'

// ** context
import { useAuth } from 'src/hooks/useAuth'

// ** fetch
import { useMutation } from 'react-query'
import { saveUserTokenToBrowser } from 'src/shared/auth/storage'
import { googleAuth } from 'src/apis/sign.api'

// ** third party
import jwt_decode from 'jwt-decode'
import { toast } from 'react-hot-toast'
import logger from '@src/@core/utils/logger'

export default function GoogleButton() {
  const router = useRouter()
  const emailRef = useRef('')

  // ** Hooks
  const auth = useAuth()

  useEffect(() => {
    generateGoogleLoginButton()
  }, [router])

  const googleMutation = useMutation(
    (credential: string) => googleAuth(credential),
    {
      onSuccess: res => {
        logger.info('google auth success res : ', res)
        auth.updateUserInfo(res)
        router.replace('/')
      },
      onError: err => {
        if (err === 'NOT_A_MEMBER') {
          router.replace(
            {
              pathname: '/signup/',
              query: { email: emailRef.current },
            },
            '/signup/',
          )
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
        <div id='buttonDiv'></div>
      </GoogleButtonWrapper>
    </>
  )
}

const GoogleButtonWrapper = styled.div`
  position: absolute;
  opacity: 0.0001 !important;
`
