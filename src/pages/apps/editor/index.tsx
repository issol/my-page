import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Editor from 'src/@core/components/editor/WysiwygEditor'
import { notificationTest } from 'src/apis/notification.api'

export default function GlozEditor() {
  const [contents, setContents] = useState('')
  const router = useRouter()
  function handleDownload() {
    if (typeof window === 'object') {
      sessionStorage.setItem('content', contents)
    }

    router.push('/apps/editor/print')
  }
  console.log(contents)

  return (
    <>
      {/* <button onClick={() => notificationTest()}>테스트용 버튼</button> */}
      <button className='preview' onClick={() => handleDownload()}>
        Download
      </button>
      <Editor
        initialEditType='wysiwyg'
        onChange={(value: any) => {
          setContents(value)

          return
        }}
      />
    </>
  )
}
