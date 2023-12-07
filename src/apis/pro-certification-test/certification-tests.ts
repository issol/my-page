import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro-certification-test/certification-test'

export const getProCertificationTestList = async (
  filters: ProCertificationTestFilterType,
  userId: number,
  userCompany: string,
): Promise<{
  data: ProCertificationTestListType[]
  totalCount: number
}> => {
  const { data } = await axios.get(
    `/api/enough/cert/test/pro/${userId}/certification-test?userCompany=${userCompany}&${makeQuery(
      filters,
    )}`,
  )

  return data
  // const data = [
  //   {
  //     id: 1,
  //     jobType: 'Job Type 1',
  //     role: 'Role 1',
  //     sourceLanguage: 'ko',
  //     targetLanguage: 'en',
  //     basicTest: {
  //       isExist: false,
  //     },
  //   },
  //   {
  //     id: 2,
  //     jobType: 'Job Type 2',
  //     role: 'Role 2',
  //     sourceLanguage: 'ko',
  //     targetLanguage: 'en',
  //     basicTest: {
  //       isExist: true,
  //     },
  //   },
  //   {
  //     id: 3,
  //     jobType: 'Job Type 3',
  //     role: 'Role 3',
  //     sourceLanguage: 'ko',
  //     targetLanguage: 'en',
  //     basicTest: {
  //       isExist: true,
  //     },
  //   },
  //   {
  //     id: 4,
  //     jobType: 'Job Type 4',
  //     role: 'Role 4',
  //     sourceLanguage: 'ko',
  //     targetLanguage: 'en',
  //     basicTest: {
  //       isExist: false,
  //     },
  //   },
  // ]
  // return {
  //   data: data,
  //   totalCount: data.length,
  // }
}

export const getIsProBasicTestPassed = async (
  targetLanguage: string,
  userId: number,
): Promise<boolean> => {
  const { data } = await axios.get(
    `/api/enough/cert/test/pro/${userId}/check-Passed-Basic?targetLanguage=${targetLanguage}`,
  )

  return data
}
