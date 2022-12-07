import dynamic from 'next/dynamic'

const Editor = dynamic<any>(() => import('./editor').then(m => m), { ssr: false })

export default function GlozEditor() {
  return <Editor />
}
