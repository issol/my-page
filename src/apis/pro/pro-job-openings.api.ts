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
  // const { data } = await axios.get(
  //   `/api/enough/cert/test/pro/${userId}/applied-role?${makeQuery(filters)}`,
  // )
  // return data
  const getRandomDate = (): Date => {
    const randomDays = Math.floor(Math.random() * 30)
    return addDays(new Date(), randomDays)
  }

  const testData: JobOpeningListType[] = [
    {
      id: 1,
      jobType: 'Full-time',
      role: 'Developer',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '1-2 year(s)',
      dueDate: getRandomDate(),
      dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    },
    {
      id: 2,
      jobType: 'Part-time',
      role: 'Designer',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '3-5 years',
      dueDate: getRandomDate(),
      dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    },
    {
      id: 3,
      jobType: 'Contract',
      role: 'Tester',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '6-9 years',
      dueDate: getRandomDate(),
      dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    },
    {
      id: 4,
      jobType: 'Full-time',
      role: 'Manager',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      yearsOfExperience: '10+ years',
      dueDate: getRandomDate(),
      dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    },
    {
      id: 5,
      jobType: 'Part-time',
      role: 'Developer',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      yearsOfExperience: '1-2 year(s)',
      dueDate: getRandomDate(),
      dueDateTimezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    },
    // ... add more data as needed
  ]

  return {
    data: testData,
    totalCount: testData.length,
  }
}

export const getJobOpeningDetail = async (
  id: number,
): Promise<JobOpeningDetailType> => {
  //TODO Endpoint 추가
  const testData: JobOpeningDetailType = {
    id: 1,
    jobType: 'Full-time',
    role: 'Software Developer',
    sourceLanguage: 'en',
    targetLanguage: 'ko',
    yearsOfExperience: '5',
    dueDate: new Date().toISOString(),
    postedDate: new Date().toISOString(),
    postedTimezone: {
      code: 'KR',
      label: 'Korea, Republic of',
      phone: '+82',
    },
    vendorTimezone: {
      code: 'US',
      label: 'United States',
      phone: '+1',
    },
    content: {
      blocks: [
        {
          key: 'a0oh6',
          data: {},
          text: '1. Avoid Over-Interpretation',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [
            {
              style: 'BOLD',
              length: 25,
              offset: 3,
            },
          ],
        },
        {
          key: '1e0tk',
          data: {},
          text: " Excessive interpretation in your translation may result in point deductions. It's advisable to stay faithful to the original meaning while avoiding substantial changes.",
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: '3534j',
          data: {},
          text: '',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: '7jr49',
          data: {},
          text: '2. Contextual Comprehension',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [
            {
              style: 'BOLD',
              length: 24,
              offset: 3,
            },
          ],
        },
        {
          key: '8v0mo',
          data: {},
          text: " Fully understand the source text and perform your translation within its context. Don't isolate words or phrases; focus on capturing the entire sentence's meaning.",
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: 'd2m69',
          data: {},
          text: '',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: '31vmn',
          data: {},
          text: '3. Lexical Diversity',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [
            {
              style: 'BOLD',
              length: 17,
              offset: 3,
            },
          ],
        },
        {
          key: '32dta',
          data: {},
          text: 'Utilize a wide range of vocabulary to express diversity in your translation. Avoid repetitive words or expressions, and opt for suitable synonyms and phrases.',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: 'ac05r',
          data: {},
          text: '',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: '3mb1a',
          data: {},
          text: '4. Grammar and Structure',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [
            {
              style: 'BOLD',
              length: 21,
              offset: 3,
            },
          ],
        },
        {
          key: '659fk',
          data: {},
          text: ' Adhere to grammar rules and use proper sentence structures. Grammar errors can impact your evaluation.',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: 'cfsrc',
          data: {},
          text: '',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
        {
          key: '6fsqq',
          data: {},
          text: '5. Style',
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [
            {
              style: 'BOLD',
              length: 5,
              offset: 3,
            },
          ],
        },
        {
          key: '34da8',
          data: {},
          text: " Adapt your translation style to match the source text's style and purpose. For formal documents, use formal language, and for informal ones, use conversational language.",
          type: 'unstyled',
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
      ],
      entityMap: {},
    },
  }

  return testData
}

export const getJobOpeningApplyStatus = async (): Promise<{ code: number }> => {
  //TODO Endpoint 추가
  return { code: applyResponseEnum.ALREADY_APPLIED }
}

export const createJobInfo = async (
  userId: number,
  payload: { jobType: string; role: string; source: string; target: string },
) => {
  await axios.post(`/api/enough/u/job-info/${userId}`, { ...payload })
}
