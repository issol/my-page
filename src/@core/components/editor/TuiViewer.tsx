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

  return (
    <div style={{ border: '1px solid #ccc', padding: '24px', background: '#ffffff' }}>
      <Viewer {...props} initialValue={initialValue} />
    </div>
  )
}

export default TuiViewer
