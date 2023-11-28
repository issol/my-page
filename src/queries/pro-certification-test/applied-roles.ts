import { getProAppliedRoles } from '@src/apis/pro-certification-test/applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesType,
} from '@src/types/pro-certification-test/applied-roles'
import { useQuery } from 'react-query'

export const useGetProAppliedRoles = (filters: ProAppliedRolesFilterType) => {
  return useQuery<{ data: ProAppliedRolesType[]; totalCount: number }>(
    ['Applied-roles', filters],
    () => getProAppliedRoles(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
