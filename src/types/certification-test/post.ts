import { FilePostType } from 'src/apis/client-guideline.api'

export type TestMaterialFormType = {
  writer: string
  email: string
  source?: string
  target: string
  jobType?: string
  role?: string
  googleFormLink: string
  testType: string
  content: any
  text: string
  files?: Array<FilePostType>
}
