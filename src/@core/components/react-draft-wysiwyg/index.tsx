// ** Next Import
import dynamic from 'next/dynamic'

// ** Types
import { EditorProps } from 'react-draft-wysiwyg'

import createImagePlugin from '@draft-js-plugins/image'

interface MyEditorProps extends EditorProps {
  plugins?: any[]
}

const imagePlugin = createImagePlugin()
const plugins = [imagePlugin]

// ! To avoid 'Window is not defined' error
const ReactDraftWysiwyg = dynamic<MyEditorProps>(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  {
    ssr: false,
  },
)

export default function MyEditor(props: EditorProps) {
  return <ReactDraftWysiwyg plugins={plugins} {...props} />
}

// export default ReactDraftWysiwyg
