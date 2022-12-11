import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Editor from 'src/@core/components/editor/WysiwygEditor'
import { notificationTest } from 'src/apis/notification.api'
import Viewer from 'src/@core/components/editor/TuiViewer'

export default function Potato() {
  const [contents, setContents] = useState('')
  const [test, setTest] = useState('')
  const router = useRouter()
  function handleDownload() {
    if (typeof window === 'object') {
      sessionStorage.setItem('content', contents)
    }

    router.push('/apps/editor/print')
  }

  function showPreview() {
    setTimeout(() => {
      setTest(contents)
    }, 100)
    setTest('')
  }

  return (
    <>
      {/* <button onClick={() => notificationTest()}>테스트용 버튼</button> */}
      <button
        className='preview'
        onClick={() => handleDownload()}
        style={{
          padding: '12px',
          marginRight: '8px',
          marginBottom: '8px',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        Download
      </button>
      <button
        className='preview'
        onClick={() => showPreview()}
        style={{
          padding: '12px',
          marginRight: '8px',
          marginBottom: '8px',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        Show preview
      </button>
      <Editor initialEditType='wysiwyg' onChange={(value: any) => setContents(value)} />
      <div style={{ marginTop: '24px' }}>{test ? <Viewer initialValue={test} /> : ''}</div>
    </>
  )
}
