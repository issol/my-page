import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import styled from 'styled-components'

export default function GoogleButton(handleCredentialResponse: any) {
  const router = useRouter()
  useEffect(() => {
    generateGoogleLoginButton()
  }, [router])

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
  /* opacity: 0.7; */
  opacity: 0.0001 !important;
`
