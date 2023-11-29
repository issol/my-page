import { ContractParam } from '@src/apis/contract.api'
import {
  getProAppliedRoles,
  getProContractDetail,
} from '@src/apis/pro-certification-test/applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesType,
} from '@src/types/pro-certification-test/applied-roles'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
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

export const useGetProContract = ({ type, language }: ContractParam) => {
  return useQuery(
    ['get-contract/detail', { type, language }],
    () => {
      return getProContractDetail({ type, language })
    },
    {
      // enabled: false,
      // enabled: !!type && !!language,
      staleTime: 60 * 1000, // 1min
      // keepPreviousData: true,
      suspense: true,

      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
