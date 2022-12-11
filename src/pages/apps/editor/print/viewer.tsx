import { useEffect, useState } from 'react'
import Viewer from 'src/@core/components/editor/TuiViewer'

export default function PrintViewer() {
  const [contents, setContents] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'object') {
      setContents(sessionStorage.getItem('content') || '')
    }
    // if (contents) {
    //   window.print()
    // }
  }, [contents])

  return <Viewer initialValue={contents} />
}
