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
      sourceLanguage: 'KR',
      targetLanguage: 'US',
      basicTest: {
        score: 80,
        isPassed: true,
      },
      skillTest: {
        score: 85,
        isPassed: true,
      },
    },
    {
      id: 2,
      jobType: 'Job Type 2',
      role: 'Role 2',
      sourceLanguage: 'US',
      targetLanguage: 'KR',
      basicTest: {
        score: 90,
        isPassed: true,
      },
      skillTest: {
        score: 95,
        isPassed: true,
      },
    },
    {
      id: 3,
      jobType: 'Job Type 3',
      role: 'Role 3',
      sourceLanguage: 'KR',
      targetLanguage: 'US',
      basicTest: null,
      skillTest: {
        score: 85,
        isPassed: false,
      },
    },
    {
      id: 4,
      jobType: 'Job Type 4',
      role: 'Role 4',
      sourceLanguage: 'US',
      targetLanguage: 'KR',
      basicTest: {
        score: 80,
        isPassed: false,
      },
      skillTest: {
        score: 85,
        isPassed: true,
      },
    },
  ]
  return {
    data: data,
    totalCount: data.length,
  }
}
