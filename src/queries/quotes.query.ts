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
    ['get-quotes/calendar', date, filter],
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

export const useGetProjectInfo = (id: number) => {
  return useQuery([`quotes-projectInfo-${id}`, id], () => getProjectInfo(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,
  })
}

export const useGetProjectTeam = (id: number) => {
  return useQuery([`quotes-projectTeam-${id}`, id], () => getProjectTeam(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,

    select: data => {
      return data.map(value => ({ ...value, id: value.id }))
    },
  })
}

export const useGetClient = (id: number) => {
  return useQuery([`quotes-client-${id}`, id], () => getClient(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,
  })
}

export const useGetLangItem = (id: number) => {
  return useQuery([`quotes-langItem-${id}`, id], () => getLangItems(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,
  })
}

export const useGetVersionHistory = (id: number) => {
  return useQuery([`quotes-history-${id}`, id], () => getVersionHistory(id), {
    staleTime: 60 * 1000, // 1
    suspense: true,
  })
}
