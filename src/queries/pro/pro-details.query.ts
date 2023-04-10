import { getProOverview, getProWorkDays } from '@src/apis/pro-details.api'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { useQuery } from 'react-query'
import _ from 'lodash'

export const useGetProOverview = (userId: number) => {
  const id = typeof userId === 'number' ? userId : 0
  return useQuery<DetailUserType, Error, DetailUserType>(
    `${userId}`,
    () => getProOverview(id!),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 400,
      // select: (data: DetailUserType) => {
      //   const res = data

      //   if (data.appliedRoles && data.certifiedRoles) {
      //     const roles = _.concat(data.appliedRoles, data.certifiedRoles)
      //   }

      //   return res
      // },
    },
  )
}

export const useGetProWorkDays = (userId: number, year: number) => {
  return useQuery(
    [`${userId}-workDays`, year],
    () => getProWorkDays(userId, year),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 400,
    },
  )
}
