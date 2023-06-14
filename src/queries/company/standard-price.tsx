import {
  getCatInterfaceHeaders,
  getClientPriceList,
  getProPriceList,
  getStandardClientPrice,
} from '@src/apis/company-price.api'
import { StandardClientPriceListType } from '@src/types/common/standard-price'
import { useQuery } from 'react-query'

export type ClientPriceListFilterType = {
  source?: string
  target?: string
  clientId?: number | null
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

export const useGetStandardPrices = () => {
  return useQuery<{ data: StandardClientPriceListType[]; count: number }>(
    'standard-client-prices',
    () => getStandardClientPrice(),
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
