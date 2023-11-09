import {
  getProWorkDays,
  getMyOverview,
  getProOverview,
} from '@src/apis/pro/pro-details.api'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { useQuery } from 'react-query'
import _ from 'lodash'
import { ProInvoiceListFilterType } from '@src/types/invoice/common.type'
import {
  // getProInvoiceList,
  // getProInvoiceListCalendar,
} from '@src/apis/pro/pro-invoice.api'

export const useGetProOverview = (userId: number) => {
  const id = typeof userId === 'number' ? userId : 0
  return useQuery<DetailUserType, Error>(
    // Onboarding에서 유저 조회 후 바로 동일 유저를 Pro에서 조회할 경우 queryKey가 겹쳐서 appliedRoles 값이 없는 경우가 있음. 쿼리키를 지정함
    `proId:${userId}`,
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

// export const useGetProWorkDays = (userId: number, year: number) => {
//   return useQuery(
//     [`${userId}-workDays`, year],
//     () => getProWorkDays(userId, year),
//     {
//       staleTime: 60 * 1000, // 1
//       suspense: true,
//       useErrorBoundary: (error: any) => error.response?.status >= 400,
//     },
//   )
// }

// export const useGetProInvoiceList = (
//   id: number,
//   filters: ProInvoiceListFilterType,
// ) => {
//   return useQuery(
//     [`${id}-pro-invoice-list`, filters],
//     () => getProInvoiceList(id, filters),
//     {
//       staleTime: 60 * 1000,
//       suspense: true,
//     },
//   )
// }

// export const useGetProInvoiceListCalendar = (
//   year: number,
//   month: number,
//   filter: ProInvoiceListFilterType,
// ) => {
//   return useQuery(
//     ['invoice/receivable/calendar', year, month, filter],
//     () => {
//       return getProInvoiceListCalendar(year, month, filter)
//     },
//     {
//       suspense: true,
//       staleTime: 60 * 1000,
//       keepPreviousData: true,
//     },
//   )
// }

//pro가 my page에서 보는 데이터
export const useGetMyOverview = (userId: number) => {
  const id = typeof userId === 'number' ? userId : 0
  return useQuery(`myId:${userId}`, () => getMyOverview(id!), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    useErrorBoundary: true,
  })
}

export const useGetProWorkDays = (
  userId: number,
  year: number,
  month: number,
) => {
  return useQuery(
    [`myOffDays:${userId}`, year, month],
    () => getProWorkDays(userId, year, month),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: true,
    },
  )
}
