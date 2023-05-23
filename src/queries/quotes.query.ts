import {
  MemberListType,
  getMemberList,
  getQuotesCalendarData,
  getQuotesDetail,
  getQuotesList,
} from '@src/apis/quotes.api'
import { FilterType } from '@src/pages/quotes'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { QuotesFilterType } from '@src/types/quotes/quote'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetMemberList = () => {
  return useQuery(
    ['get-member/list'],
    () => {
      return getMemberList()
    },
    {
      select: (data: Array<MemberListType>) =>
        data.map(item => {
          const name = getLegalName({
            firstName: item.firstName!,
            middleName: item.middleName,
            lastName: item.lastName!,
          })
          return {
            value: item.userId.toString(),
            label: name,
            jobTitle: item.jobTitle,
          }
        }),
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
export const useGetQuotesList = (filter: QuotesFilterType) => {
  return useQuery(
    ['get-quotes/list'],
    () => {
      return getQuotesList(filter)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
export const useGetQuotesCalendarData = (
  date: string,
  filter: QuotesFilterType,
) => {
  return useQuery(
    ['get-quotes/calendar'],
    () => {
      return getQuotesCalendarData(date, filter)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
export const useGetQuotesDetail = (id: number) => {
  return useQuery(
    ['get-quotes/detail', id],
    () => {
      return getQuotesDetail(id)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      // enabled: !!id,
    },
  )
}
