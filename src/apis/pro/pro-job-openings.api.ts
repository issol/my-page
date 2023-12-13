import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  JobOpeningListFilterType,
  JobOpeningListType,
} from '@src/types/pro/pro-job-openings'

export const getJobOpenings = async (
  filters: JobOpeningListFilterType,
): Promise<{
  data: JobOpeningListType[]
  totalCount: number
}> => {
  // const { data } = await axios.get(
  //   `/api/enough/cert/test/pro/${userId}/applied-role?${makeQuery(filters)}`,
  // )
  // return data
  const testData: JobOpeningListType[] = [
    {
      id: 1,
      jobType: 'Full-time',
      role: 'Developer',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '1-2 year(s)',
      dueDate: 'Less than 1 day left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 2,
      jobType: 'Part-time',
      role: 'Designer',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '3-5 years',
      dueDate: '1-2 days left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 3,
      jobType: 'Contract',
      role: 'Tester',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '6-9 years',
      dueDate: '3-6 days left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 4,
      jobType: 'Full-time',
      role: 'Manager',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '10+ years',
      dueDate: '1 week left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 5,
      jobType: 'Part-time',
      role: 'Developer',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '1-2 year(s)',
      dueDate: '1-2 weeks left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 6,
      jobType: 'Contract',
      role: 'Designer',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '3-5 years',
      dueDate: '2 weeks and more',
      dueDateTimezone: 'UTC',
    },
    {
      id: 7,
      jobType: 'Full-time',
      role: 'Tester',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '6-9 years',
      dueDate: 'Less than 1 day left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 8,
      jobType: 'Part-time',
      role: 'Manager',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '10+ years',
      dueDate: '1-2 days left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 9,
      jobType: 'Contract',
      role: 'Developer',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '1-2 year(s)',
      dueDate: '3-6 days left',
      dueDateTimezone: 'UTC',
    },
    {
      id: 10,
      jobType: 'Full-time',
      role: 'Designer',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '3-5 years',
      dueDate: '1 week left',
      dueDateTimezone: 'UTC',
    },
  ]

  return {
    data: testData,
    totalCount: testData.length,
  }
}
