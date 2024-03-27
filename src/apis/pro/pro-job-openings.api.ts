import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  JobOpeningDetailType,
  JobOpeningListFilterType,
  JobOpeningListType,
  applyResponseEnum,
} from '@src/types/pro/pro-job-openings'
import { addDays, format } from 'date-fns'

export const getJobOpenings = async (
  filters: JobOpeningListFilterType,
): Promise<{
  data: JobOpeningListType[]
  totalCount: number
}> => {
  console.log(makeQuery(filters))

  const { data } = await axios.get(
    `/api/enough/recruiting/job-opening?${makeQuery(filters)}`,
  )
  return data
  // const { data } = await axios.get(
  //   `/api/enough/cert/test/pro/${userId}/applied-role?${makeQuery(filters)}`,
  // )
  // return data
  // const getRandomDate = (): Date => {
  //   const randomDays = Math.floor(Math.random() * 30)
  //   return addDays(new Date(), randomDays)
  // }
  // const testData: JobOpeningListType[] = [
  //   {
  //     id: 1,
  //     jobType: 'Full-time',
  //     role: 'Developer',
  //     sourceLanguage: 'en',
  //     targetLanguage: 'ko',
  //     yearsOfExperience: '1-2 year(s)',
  //     dueDate: getRandomDate(),
  //     dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  //   },
  //   {
  //     id: 2,
  //     jobType: 'Part-time',
  //     role: 'Designer',
  //     sourceLanguage: 'ko',
  //     targetLanguage: 'en',
  //     yearsOfExperience: '3-5 years',
  //     dueDate: getRandomDate(),
  //     dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  //   },
  //   {
  //     id: 3,
  //     jobType: 'Contract',
  //     role: 'Tester',
  //     sourceLanguage: 'en',
  //     targetLanguage: 'ko',
  //     yearsOfExperience: '6-9 years',
  //     dueDate: getRandomDate(),
  //     dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  //   },
  //   {
  //     id: 4,
  //     jobType: 'Full-time',
  //     role: 'Manager',
  //     sourceLanguage: 'ko',
  //     targetLanguage: 'en',
  //     yearsOfExperience: '10+ years',
  //     dueDate: getRandomDate(),
  //     dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  //   },
  //   {
  //     id: 5,
  //     jobType: 'Part-time',
  //     role: 'Developer',
  //     sourceLanguage: 'en',
  //     targetLanguage: 'ko',
  //     yearsOfExperience: '1-2 year(s)',
  //     dueDate: getRandomDate(),
  //     dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  //   },
  //   // ... add more data as needed
  // ]
  // return {
  //   data: testData,
  //   totalCount: testData.length,
  // }
}

export const getJobOpeningDetail = async (
  id: number,
): Promise<JobOpeningDetailType> => {
  const { data } = await axios.get(
    `/api/enough/recruiting/job-opening/detail/${id}`,
  )
  return data
}

export const getJobOpeningApplyStatus = async (
  postingId: number,
): Promise<{ code: number }> => {
  const { data } = await axios.get(
    `/api/enough/recruiting/job-opening/${postingId}`,
  )

  return data
}

export const createJobInfo = async (
  userId: number,
  payload: { jobType: string; role: string; source: string; target: string },
) => {
  await axios.post(`/api/enough/u/pu/apply-job-opening`, {
    data: [payload],
  })
}
