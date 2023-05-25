import { JobInfoType } from '../sign/personalInfoTypes'

export type ProFilterType = {
  jobType: { label: string; value: string }[]
  role: { label: string; value: string; jobType: string[] }[]
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  experience: { label: string; value: string }[]
  status: { label: string; value: string }[]
  clients: { label: string; value: string }[]
  search: string
}

export type ProListFilterType = {
  take: number
  skip: number
  status?: string[]
  clients?: string[]
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
  resume: Array<{
    id: number
    fileName: string
    filePath: string
    url: string
    fileExtension: string
  }>
  status: string
  isOnboarded: boolean
  onboardedAt: string
  experience: string
  jobInfo: Array<ProListJobInfoType>
}
