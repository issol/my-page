import { useQuery } from 'react-query'
import { getTestMaterialList } from 'src/apis/certification-test.api'
import {
  TestMaterialFilterPayloadType,
  TestMaterialListType,
} from 'src/types/certification-test/list'

export const useGetTestMaterialList = (
  filters: TestMaterialFilterPayloadType | null,
) => {
  return useQuery<{ data: TestMaterialListType[]; totalCount: number }>(
    ['test-material-list', filters],
    () => getTestMaterialList(filters!),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,
      enabled: !!filters,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
