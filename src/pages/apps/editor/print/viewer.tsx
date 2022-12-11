import { ReactNode, useEffect, useState } from 'react'
import Viewer from 'src/@core/components/editor/TuiViewer'

export default function PrintViewer() {
  const [contents, setContents] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'object') {
      setContents(sessionStorage.getItem('content') || '')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'object' && contents !== '') {
      setTimeout(() => {
        window.print()
      }, 1000)
    }
  }, [contents])

  return <div style={{ margin: '24px' }}>{contents ? <Viewer initialValue={contents} /> : ''}</div>
}
