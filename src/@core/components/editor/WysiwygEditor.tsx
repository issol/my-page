import dynamic from 'next/dynamic'
import * as React from 'react'
import { Editor as EditorType, EditorProps } from '@toast-ui/react-editor'
import { TuiEditorWithForwardedProps } from './TuiEditorWrapper'
import { useRouter } from 'next/router'

interface EditorPropsWithHandlers extends EditorProps {
  onChange?(value: string): void
}

const Editor = dynamic<TuiEditorWithForwardedProps>(() => import('./TuiEditorWrapper'), { ssr: false })
const EditorWithForwardedRef = React.forwardRef<EditorType | undefined, EditorPropsWithHandlers>((props, ref) => (
  <Editor {...props} forwardedRef={ref as React.MutableRefObject<EditorType>} />
))

interface Props extends EditorProps {
  onChange(value: string): void

  valueType?: 'markdown' | 'html'
}

const WysiwygEditor: React.FC<Props> = props => {
  const { initialValue, previewStyle, height, initialEditType, useCommandShortcut } = props
  const router = useRouter()

  const editorRef = React.useRef<EditorType>()
  const handleChange = React.useCallback(() => {
    if (!editorRef.current) {
      return
    }

    const instance = editorRef.current.getInstance()
    const valueType = props.valueType || 'markdown'

    // props.onChange(valueType === 'markdown' ? instance.getMarkdown() : instance.getHTML())
    props.onChange(instance.getMarkdown())
  }, [props, editorRef])

  function handleDownload() {
    if (typeof window === 'object') {
      sessionStorage.setItem('content', editorRef.current ? editorRef.current.toString() : '')
    }

    router.push('/apps/editor/print')
  }

  return (
    <div>
      <EditorWithForwardedRef
        {...props}
        initialValue={initialValue || 'hello react editor world!'}
        previewStyle={previewStyle || 'vertical'}
        height={height || '600px'}
        initialEditType={initialEditType || 'markdown'}
        useCommandShortcut={useCommandShortcut || true}
        ref={editorRef}
        onChange={handleChange}
      />
      {/* <button className='preview' onClick={() => handleDownload()}>
        Download
      </button> */}
    </div>
  )
}

export default WysiwygEditor
