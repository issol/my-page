import {
  MemberListType,
  getClient,
  getLangItems,
  getMemberList,
  getProjectInfo,
  getProjectTeam,
  getQuotesCalendarData,
  getQuotesList,
  getVersionHistory,
} from '@src/apis/quote/quotes.api'
import { FilterType } from '@src/pages/quotes/quote-list'
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
            value: Number(item.userId),
            label: name,
            jobTitle: item.jobTitle,
          }
        }),
      suspense: true,
      staleTime: 10 * 1000,
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
    ['quotesList', { type: 'list' }, filter],
    () => {
      return getQuotesList(filter)
    },
    {
      suspense: true,
      staleTime: 10 * 1000,
      keepPreviousData: true,
    },
  )
}

export const useGetQuotesCalendarData = (
  year: number,
  month: number,
  filter: QuotesFilterType,
) => {
  return useQuery(
    ['quotesList', { type: 'calendar' }, year, month, filter],
    () => {
      return getQuotesCalendarData(year, month, filter)
    },
    {
      suspense: true,
      staleTime: 10 * 1000,
      keepPreviousData: true,
    },
  )
}

export const useGetProjectInfo = (id: number) => {
  return useQuery(
    [`quotesDetail`, { type: 'project' }, id],
    () => getProjectInfo(id),
    {
      staleTime: 10 * 1000, // 1

      suspense: true,
    },
  )
}

export const useGetProjectTeam = (id: number) => {
  return useQuery(
    [`quotesDetail`, { type: 'team' }, id],
    () => getProjectTeam(id),
    {
      staleTime: 10 * 1000, // 1

      suspense: true,

      // select: data => {
      //   return data.map(value => ({ ...value, id: value.id }))
      // },
    },
  )
}

export const useGetClient = (id: number) => {
  return useQuery(
    [`quotesDetail`, { type: 'client' }, id],
    () => getClient(id),
    {
      staleTime: 10 * 1000, // 1

      suspense: true,
    },
  )
}

export const useGetLangItem = (id: number) => {
  return useQuery(
    [`quotesDetailItems`, { type: 'item' }, id],
    () => getLangItems(id),
    {
      staleTime: 10 * 1000, // 1

      suspense: true,
    },
  )
}

export const useGetVersionHistory = (id: number) => {
  return useQuery([`quotesHistory`, id], () => getVersionHistory(id), {
    staleTime: 10 * 1000, // 1
    suspense: true,
  })
}
