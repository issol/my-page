import { useEffect, useState } from 'react'
// import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'

// import chart from '@toast-ui/editor-plugin-chart'
// import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
// import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
// import uml from '@toast-ui/editor-plugin-uml'

export default function PrintViewer() {
  const [viewer, setViewer] = useState<any>(null)

  const chartOptions = {
    minWidth: 100,
    maxWidth: 600,
    minHeight: 100,
    maxHeight: 300
  }
  // useEffect(() => {
  //   setViewer(
  //     new Viewer({
  //       el: document.querySelector('#viewer') as HTMLElement,
  //       initialValue: '',
  //       plugins: [[chart, chartOptions], codeSyntaxHighlight, tableMergedCell, uml]
  //     })
  //   )

  //   return () => {
  //     sessionStorage.removeItem('content')
  //   }
  // }, [])

  // useEffect(() => {
  //   if (viewer) {
  //     if (typeof window === 'object') {
  //       viewer.setMarkdown(sessionStorage.getItem('content') || '')
  //     }
  //     window.print()
  //   }
  // }, [viewer])

  return <div id='viewer' style={{ padding: '20px', overflow: 'scroll' }}></div>
}
