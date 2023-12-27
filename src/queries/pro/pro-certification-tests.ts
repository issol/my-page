import { getProCertificationTestList } from '@src/apis/pro/pro-certification-tests'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro/pro-certification-test'
import { useQuery } from 'react-query'

export const useGetProCertificationTestList = (
  filters: ProCertificationTestFilterType,
  userId: number,
  userCompany: string,
) => {
  return useQuery<{ data: ProCertificationTestListType[]; totalCount: number }>(
    ['CertificationTest-list', filters],
    () => getProCertificationTestList(filters, userId, userCompany),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
