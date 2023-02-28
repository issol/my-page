import { useQuery } from 'react-query'
import { getTestMaterialList } from 'src/apis/certification-test.api'
import {
  TestMaterialFilterPayloadType,
  TestMaterialListType,
} from 'src/types/certification-test/list'

export const useGetTestMaterialList = (
  filters: TestMaterialFilterPayloadType,
) => {
  return useQuery<{ data: TestMaterialListType[]; count: number }>(
    'test-material-list',
    () => getTestMaterialList(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
