import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/jobPosting'

export type StatusType = 'Ongoing' | 'Paused' | 'Fulfilled' | 'Not started' | ''
export type JobPostingDataType = {
  id: number
  status: StatusType
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  openings: number
  yearsOfExperience: string
  writer: string
  email: string
  dueDate: string
  dueDateTimezone: string
  jobPostLink: string
  view: number
}
export const getJobPostingList = async (
  filters: FilterType,
): Promise<{
  data: Array<JobPostingDataType> | []
  count: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/recruiting/jobposting?${makeQuery({
        ...filters,
        company: 'GloZ',
      })}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type JobPostingDetailType = {
  id: number
  userId: number
  status: StatusType
  writer: string
  email: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  dueDate: string
  openings: number
  dueDateTimezone: string
  yearsOfExperience: string
  postLink: Array<{ id: number; category: string; link: string }> // postLink로 보낸 값
  jobPostLink: string // short url
  createdAt: string
  content: any
  view: number
}
export const getJobPostingDetail = async (
  id: number,
): Promise<JobPostingDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/recruiting/jobposting/${id}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export type FormType = {
  status: StatusType
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  yearsOfExperience: string
  openings?: number
  dueDate?: string
  dueDateTimezone?: string
  postLink: Array<{ category: string; link: string }>
  content: any
  text: string
}

//post
export const postJobPosting = async (
  form: FormType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.post(`/api/enough/recruiting/jobposting`, {
      ...form,
      company: 'GloZ',
    })
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

//update
export const updateJobPosting = async (
  id: number,
  form: FormType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/recruiting/jobposting/${id}`,
      form,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

//delete
export const deleteJobPosting = async (id: number) => {
  try {
    return await axios.delete(`/api/enough/recruiting/jobposting/${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
