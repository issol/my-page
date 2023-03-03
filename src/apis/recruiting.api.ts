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
    // const { data } = await axios.get(`/api/enough/onboard/guideline`)
    // return data
    return {
      onGoing: 1000,
      done: 300,
      hold: 300,
      total: 1600,
    }
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
  numberOfLinguist: number
  jobStatus: string
  isHide: boolean
}
export const getRecruitingList = async (
  filters: FilterType,
): Promise<{
  data: Array<RecruitingDataType> | []
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
          client: 'Naver',
          jobType: 'Dubbing',
          role: 'Audio describer',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          writer: 'Bon Kim',
          dueDate: Date(),
          numberOfLinguist: 3,
          jobStatus: 'Paused',
          isHide: true,
        },
        {
          id: 2,
          status: 'Fulfilled',
          client: 'GloZ',
          jobType: 'Webnovel',
          role: 'DTPer',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          writer: 'Bon Kim',
          dueDate: Date(),
          numberOfLinguist: 3,
          jobStatus: 'Paused',
          isHide: false,
        },
        {
          id: 3,
          status: 'Paused',
          client: 'RIDI',
          jobType: 'Interpretation',
          role: 'QCer',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          writer: 'Bon Kim',
          dueDate: Date(),
          numberOfLinguist: 3,
          jobStatus: 'Not started',
          isHide: false,
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

export type CurrentHistoryType = {
  id: number
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
  numberOfLinguist: number
  dueDate: string | null
  dueDateTimezone: string | null
  jobPostLink: string // short url
  content: any
  isHide: boolean
}

export type DetailType = {
  currentVersion: CurrentHistoryType
  versionHistory: Array<CurrentHistoryType>
}

export const getRecruitingDetail = async (id: number): Promise<DetailType> => {
  try {
    // const { data } = await axios.get(`/api/enough/onboard/guideline/${id}`)
    // return data
    return {
      currentVersion: {
        id: 1,
        version: 2,
        writer: 'Bon kim',
        email: 'bon@glozinc.com',
        createdAt: 'Tue Feb 28 2023 14:37:36 GMT+0900 (한국 표준시)',
        status: 'Ongoing',
        client: 'GloZ',
        jobType: 'Interpretation',
        role: 'DTPer',
        sourceLanguage: 'en',
        targetLanguage: 'ko',
        numberOfLinguist: 3,
        dueDate: 'Tue Feb 28 2023 14:37:36 GMT+0900 (한국 표준시)',
        dueDateTimezone: 'KR',
        jobPostLink: 'wwww.example.com',
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
        isHide: false,
      },
      versionHistory: [
        {
          id: 2,
          version: 2,
          writer: 'Bon kim',
          email: 'bon@glozinc.com',
          createdAt: 'Tue Feb 28 2023 14:37:36 GMT+0900 (한국 표준시)',
          status: 'Ongoing',
          client: 'GloZ',
          jobType: 'Interpretation',
          role: 'DTPer',
          sourceLanguage: 'en',
          targetLanguage: 'ko',
          numberOfLinguist: 3,
          dueDate: 'Tue Feb 28 2023 14:37:36 GMT+0900 (한국 표준시)',
          dueDateTimezone: 'KR',
          jobPostLink: 'wwww.example.com',
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
          isHide: false,
        },
      ],
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export type FormType = {
  status: StatusType
  client: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  numberOfLinguist?: number
  dueDate?: string
  dueDateTimezone?: string
  jobPostLink?: string
  content: any
  text: string
}

//post
export const postRecruiting = async (
  form: FormType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.post('url', form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

//update

//hide

//delete
