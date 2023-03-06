import { FileType } from 'src/apis/client-guideline.api'

export type CurrentTestType = {
  id: number
  userId: number
  version: number
  writer: string
  email: string
  testType: string
  jobType: string
  role: string
  source: string
  target: string
  googleFormLink: string
  updatedAt: string
  content: {
    blocks: Array<{
      key: string
      text: string
      type: string
      depth: number
      inlineStyleRanges: Array<{
        offset: number
        length: number
        style: string
      }>
      entityRanges: Array<any>
      data: any
    }>
    entityMap: any
  }
  files: Array<{ id: number; name: string; size: number; fileKey: string }>
}

export type TestDetailType = {
  currentVersion: CurrentTestType
  versionHistory: Array<CurrentTestType>
}
