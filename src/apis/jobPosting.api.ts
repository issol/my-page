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
  numberOfLinguist: number
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
    //   const { data } = await axios.get(
    //     `/api/enough/onboard/guideline?${makeQuery(filters)}`,
    //   )
    //   return data
    return {
      data: [
        {
          id: 1,
          status: 'Ongoing',
          jobType: 'Dubbing',
          role: 'Audio describer',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          writer: 'Bon Kim',
          email: 'bon@glozinc.com',
          dueDate: Date(),
          numberOfLinguist: 3,
          yearsOfExperience: '1-2 year(s)',
          dueDateTimezone: 'KR',
          jobPostLink: 'www.bon.com',
          view: 12,
        },
        {
          id: 2,
          status: 'Not started',
          jobType: 'Interpretation',
          role: 'QCer',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          writer: 'Bon Kim',
          email: 'bon@glozinc.com',
          dueDate: Date(),
          numberOfLinguist: 3,
          yearsOfExperience: '1-2 year(s)',
          dueDateTimezone: 'KR',
          jobPostLink: 'www.bon.com/2',
          view: 30,
        },
        {
          id: 4,
          status: 'Not started',
          jobType: 'Interpretation',
          role: 'QCer',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          writer: 'Bon Kim',
          email: 'bon@glozinc.com',
          dueDate: Date(),
          numberOfLinguist: 3,
          yearsOfExperience: '1-2 year(s)',
          jobPostLink: 'www.bon.com/1',
          dueDateTimezone: 'KR',
          view: 100,
        },
      ],
      count: 3,
    }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type JobPostingDetailType = {
  id: number
  status: StatusType
  writer: string
  email: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  dueDate: string
  numberOfLinguist: number
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
    // const { data } = await axios.get(`/api/enough/onboard/guideline?${id}`)
    // return data
    return {
      id: 1,
      status: 'Ongoing',
      writer: 'Bon Kim',
      email: 'Bon@glozinc.com',
      jobType: 'Dubbing',
      role: 'QCer',
      sourceLanguage: 'en',
      targetLanguage: 'ko',
      dueDate: Date(),
      numberOfLinguist: 5,
      dueDateTimezone: 'KR',
      yearsOfExperience: '1-2 year(s)',
      postLink: [{ id: 1, category: '알바천국', link: 'www.bon.com' }],
      jobPostLink: 'www.shorturl.com',
      createdAt: Date(),
      content: {
        blocks: [
          {
            key: 'd9so6',
            text: 'translation guidelines document for web novels:',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b75mm',
            text: 'Purpose of Translation: Clearly define the purpose of the document being translated, whether it is an official document or a consumer product manual, etc.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      },
      view: 10,
    }
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
  numberOfLinguist?: number
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
    const { data } = await axios.post(`/api/sdlf`, form)
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
    const { data } = await axios.patch(`/api/sdlf${id}`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

//delete
export const deleteJobPosting = async (id: number) => {
  try {
    return await axios.delete(`/api/sdlf?id=${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
