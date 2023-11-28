import { getProCertificationTestList } from '@src/apis/pro-certification-test/certification-tests'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro-certification-test/certification-test'
import { useQuery } from 'react-query'

export const useGetProCertificationTestList = (
  filters: ProCertificationTestFilterType,
) => {
  return useQuery<{ data: ProCertificationTestListType[]; totalCount: number }>(
    ['CertificationTest-list', filters],
    () => getProCertificationTestList(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
