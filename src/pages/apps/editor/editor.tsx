import { useRouter } from 'next/router'
import Editor from '@toast-ui/editor'
import { useEffect, useState } from 'react'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import chart from '@toast-ui/editor-plugin-chart'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import uml from '@toast-ui/editor-plugin-uml'

export default function EditorComp() {
  const [content, setContent] = useState(`💩Write whatever you want💩`)
  const [editor, setEditor] = useState<any>(null)
  const [viewer, setViewer] = useState<any>(null)
  const router = useRouter()

  const chartOptions = {
    minWidth: 100,
    maxWidth: 600,
    minHeight: 100,
    maxHeight: 300
  }

  useEffect(() => {
    setEditor(
      new Editor({
        el: document.querySelector('#editor') as HTMLElement,
        height: '500px',
        plugins: [[chart, chartOptions], codeSyntaxHighlight, colorSyntax, tableMergedCell, uml],
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: content,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock']
        ]
      })
    )

    setViewer(
      new Viewer({
        el: document.querySelector('#viewer') as HTMLElement,
        initialValue: content,
        plugins: [[chart, chartOptions], codeSyntaxHighlight, tableMergedCell, uml]
      })
    )
  }, [])

  useEffect(() => {
    if (viewer) {
      viewer.setMarkdown(content)
    }
  }, [content])

  function handleOnClick() {
    setContent(editor?.getMarkdown())
  }

  function handleDownload() {
    if (typeof window === 'object') {
      sessionStorage.setItem('content', content)
    }

    // router.push(
    //   {
    //     pathname: '/editor/print',
    //     query: { content }
    //   },
    //   '/apps/editor/print'
    // )
    router.push('/apps/editor/print')
  }

  return (
    <div>
      <div id='editor'></div>
      <button className='preview' onClick={() => handleOnClick()}>
        show preview
      </button>
      <button className='preview' onClick={() => handleDownload()}>
        Download
      </button>
      <div
        id='viewer'
        style={{
          padding: '15px 20px',
          marginTop: '20px',
          height: '600px',
          border: '1px solid #eee',
          overflow: 'scroll',
          background: '#fff'
        }}
      ></div>
    </div>
  )
}
