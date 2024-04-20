import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/recruiting'

export type RecruitingCountType = {
  onGoing: number
  done: number
  hold: number
  total: number
}
export type StatusType = 'Ongoing' | 'Paused' | 'Fulfilled' | ''
export const getRecruitingCount = async (): Promise<RecruitingCountType> => {
  try {
    const { data } = await axios.get(
      `/api/enough/recruiting/dashboard?company=GloZ`,
    )
    return data
  } catch (e: any) {
    return {
      onGoing: 0,
      done: 0,
      hold: 0,
      total: 0,
    }
  }
}
export type RecruitingDataType = {
  id: number
  status: StatusType
  client: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  writer: string
  dueDate: string
  dueDateTimezone: string
  openings: number
  jobStatus: string
  isHide: boolean
}
export const getRecruitingList = async (
  filters: FilterType,
): Promise<{
  data: Array<RecruitingDataType> | []
  totalCount: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/recruiting?${makeQuery({ ...filters, company: 'GloZ' })}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

export type CurrentHistoryType = {
  id: number
  userId: number
  version: number
  writer: string
  email: string
  createdAt: string
  status: StatusType
  client: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  openings: number
  dueDate?: string | null
  dueDateTimezone?: string
  jobPostLink: string // short url
  content: any
  isHide: boolean
}

export type DetailType = {
  currentVersion: CurrentHistoryType
  versionHistory: Array<CurrentHistoryType>
}

export const getRecruitingDetail = async (id: number): Promise<DetailType> => {
  const { data } = await axios.get(`/api/enough/recruiting/${id}`)
  return data
}

export type FormType = {
  status: StatusType
  client: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  openings?: number
  dueDate?: string
  dueDateTimezone?: string
  jobPostLink?: string
  content: any
  text: string
  clientId: number | null
}

//post
export const postRecruiting = async (
  form: FormType,
): Promise<{ id: number }> => {
  const { data } = await axios.post('/api/enough/recruiting', {
    ...form,
    company: 'GloZ',
  })
  return data
}

//update
export const updateRecruiting = async (
  id: number,
  form: FormType,
): Promise<{ id: number }> => {
  const { data } = await axios.patch(`/api/enough/recruiting/${id}`, form)
  return data
}

//hide
export const hideRecruiting = async (id: number, hide: boolean) => {
  return await axios.patch(`/api/enough/recruiting/hide/${id}?hide=${hide}`)
}

//delete
export const deleteRecruiting = async (id: number) => {
  return await axios.delete(`/api/enough/recruiting/${id}`)
}
