import {
  getCatInterfaceHeaders,
  getStandardClientPrice,
} from '@src/apis/company-price.api'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { useQuery } from 'react-query'

export const useGetStandardPrices = () => {
  return useQuery<{ data: StandardPriceListType[]; count: number }>(
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
