import { CountryType, JobInfoType } from '../sign/personalInfoTypes'

export type ProFilterType = {
  jobType: { label: string; value: string }[]
  role: { label: string; value: string; jobType: string[] }[]
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  experience: { label: string; value: string }[]
  timezone: { id: number, label: string; code: string, pinned: boolean }[]
  status: { label: string; value: string }[]
  clientId: { name: string; clientId: number }[]
  search: string
  sortId?: string
  sortDate?: string
}

export type ProListFilterType = {
  take: number
  skip: number
  status?: string[]
  clientId?: number[]
  role?: string[]
  jobType?: string[]
  search?: string
  source?: string[]
  target?: string[]
  experience?: string[]
  sortId?: string
  sortDate?: string
}

export interface ProListJobInfoType extends JobInfoType {
  id: number
  testStatus: string
  jobId: string
  createdAt: string
  updatedAt: string
  selected: boolean
  roleRequestId: number | null
  roleRequestStatus: string | null
}

export type ProListCellType = {
  row: ProListType
}

export type ProListType = {
  id: string
  userId: number
  email: string
  firstName: string
  middleName?: string
  lastName: string
  clients: Array<{ id: number; client: string }>
  isActive: boolean
  // resume: Array<{
  //   id: number
  //   fileName: string
  //   filePath: string
  //   url: string
  //   fileExtension: string
  // }>
  resume: Array<string>
  status: string
  isOnboarded: boolean
  onboardedAt: string
  experience: string
  jobInfo: Array<ProListJobInfoType>
  order?: number | undefined
  responseLight: 70000 | 70100 | 70200 | 70300 | 70400 | 70500 | 70600 // statusCode
  ongoingJobCount: number
  avgResponseTime: number // 분단위 표시
  ongoingJobList: string[]
  timezone: CountryType
}
