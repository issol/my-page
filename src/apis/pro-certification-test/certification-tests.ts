import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro-certification-test/certification-test'

export const getProCertificationTestList = async (
  filters: ProCertificationTestFilterType,
): Promise<{
  data: ProCertificationTestListType[]
  totalCount: number
}> => {
  const data = [
    {
      id: 1,
      jobType: 'Job Type 1',
      role: 'Role 1',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      basicTest: {
        isExist: false,
      },
    },
    {
      id: 2,
      jobType: 'Job Type 2',
      role: 'Role 2',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      basicTest: {
        isExist: true,
      },
    },
    {
      id: 3,
      jobType: 'Job Type 3',
      role: 'Role 3',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      basicTest: {
        isExist: true,
      },
    },
    {
      id: 4,
      jobType: 'Job Type 4',
      role: 'Role 4',
      sourceLanguage: 'ko',
      targetLanguage: 'en',
      basicTest: {
        isExist: false,
      },
    },
  ]
  return {
    data: data,
    totalCount: data.length,
  }
}

export const getIsProBasicTestPassed = async (
  targetLanguage: string,
): Promise<boolean> => {
  return true
}
