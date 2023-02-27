import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/recruiting'

export type RecruitingCountType = {
  onGoing: number
  done: number
  hold: number
  total: number
}
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
  status: 'Ongoing' | 'Paused' | 'Fulfilled'
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
