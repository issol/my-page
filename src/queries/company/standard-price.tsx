import {
  getCatInterfaceHeaders,
  getClientPriceList,
  getProPriceList,
  getStandardPrice,
} from '@src/apis/company-price.api'
import { StandardPriceListType } from '@src/types/common/standard-price'

import { useQuery } from 'react-query'

export type ClientPriceListFilterType = {
  source?: string
  target?: string
  clientId?: number | null
  take?: number
  skip?: number
  isStandard?: boolean | null
}

export type ProPriceListFilterType = {
  proId?: number
  source?: string
  target?: string
}
export const useGetClientPriceList = (filter: ClientPriceListFilterType) => {
  return useQuery(
    ['client-price-list', filter],
    () => getClientPriceList(filter),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: false,
      // enabled: !!filter?.clientId,
    },
  )
}

export const useGetProPriceList = (filter: ProPriceListFilterType) => {
  return useQuery(['pro-price-list', filter], () => getProPriceList(filter), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: false,
    // enabled: !!filter?.clientId,
  })
}

export const useGetStandardPrices = (
  page: 'pro' | 'client',
  filter: ClientPriceListFilterType
) => {
  return useQuery<{
    data: Array<StandardPriceListType>
    count: number
  }>(
    [`standard-${page}-prices`, filter],
    () => getStandardPrice(page, filter),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
    },
  )
}

export const useGetCatInterfaceHeaders = (toolName: string) => {
  return useQuery<{ headers: Array<string>; toolName: string }>(
    `catinterface-${toolName}`,
    () => getCatInterfaceHeaders(toolName === 'memoQ' ? 'Memoq' : toolName),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
    },
  )
}
