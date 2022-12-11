import dynamic from 'next/dynamic'
import { ReactNode, useEffect, useState } from 'react'
import { ViewerProps } from '@toast-ui/react-editor'

const Viewer = dynamic(() => import('./TuiViewerWrapper'), { ssr: false })

interface Props extends ViewerProps {
  initialValue: any
  valueType?: 'markdown' | 'html'
}

const TuiViewer: React.FC<Props> = props => {
  const { initialValue } = props
  const [contents, setContents] = useState()
  const [viewer, setViewer] = useState<ReactNode>()
  useEffect(() => {
    setContents(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (contents) {
      setViewer(<Viewer {...props} initialValue={contents} />)
    }
  }, [contents])

  useEffect(() => {
    if (viewer && typeof window === 'object' && contents) {
      //   console.log(viewer?.props)
      window.print()
    }
  }, [viewer])

  return (
    <div style={{ margin: '24px', border: '1px solid #ccc', padding: '24px', background: '#ffffff' }}>
      {/* <Viewer {...props} initialValue={contents} /> */}
      {viewer}
    </div>
  )
}

export default TuiViewer
