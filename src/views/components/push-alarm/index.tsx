import logger from '@src/@core/utils/logger'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'

export default function PushAlarm() {
  const firebaseConfig = {
    apiKey: 'AIzaSyAFd9M2Z4BOltygQlYywD-A4CcSWJOuVxg',
    authDomain: 'glohub-dev.firebaseapp.com',
    projectId: 'glohub-dev',
    storageBucket: 'glohub-dev.appspot.com',
    messagingSenderId: '556457157900',
    appId: '1:556457157900:web:36822c3ed67be8a682d529',
  }

  initializeApp(firebaseConfig)
  const messaging = getMessaging()

  onMessage(messaging, payload => {
    logger.info('Message received. ', payload)
  })

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1'
  }

  function setTokenSentToServer(sent: any) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0')
  }

  function sendTokenToServer(token: any) {
    if (!isTokenSentToServer()) {
      //Todo : 서버로 토큰일 전송하는 로직 추가
      setTokenSentToServer(true)
    } else {
      logger.info(
        "Token already sent to server so won't send it again " +
          'unless it changes',
      )
    }
  }

  const handleClick = () => {
    //알림 권한 신청
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        logger.info('Notification permission granted.')
      }
    })

    getToken(messaging, {
      vapidKey:
        'BHIR--Holaz_RXxfktN8jRvOuF_uoSaM_SyGdLDnO9yKQQSLv-PIEIlr3L2e2xyquyN0_6GuTN9pAb7Qv2uJecA',
    })
      .then(currentToken => {
        if (currentToken) {
          logger.info(currentToken)
          sendTokenToServer(currentToken)
        } else {
          logger.info(
            'No registration token available. Request permission to generate one.',
          )
          setTokenSentToServer(false)
        }
      })
      .catch(err => {
        logger.error('error : ', err)
      })
  }

  useEffect(() => {
    handleClick()
  }, [])

  return (
    <>
      <div id='permission_div'>
        <div id='token'></div>
        {/* <button onClick={handleClick}>Request Permission</button> */}
      </div>
      <div id='messages'></div>
    </>
  )
}
