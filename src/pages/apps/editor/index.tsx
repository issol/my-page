import dynamic from 'next/dynamic'
import { notificationTest } from 'src/apis/notification.api'

const Editor = dynamic<any>(() => import('./editor').then(m => m), { ssr: false })

export default function GlozEditor() {
  return (
    <>
      {/* <button onClick={() => notificationTest()}>테스트용 버튼</button> */}
      {Editor && typeof window === 'object' && <Editor />}
    </>
  )
}
