import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/jobPosting'

export type JobPostingDataType = {
  id: number
  status: 'Not started' | 'Ongoing' | 'Paused' | 'Fulfilled'
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  numberOfLinguist: number
  yearsOfExperience: string
  writer: string
  email: string
  dueDate: string
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
