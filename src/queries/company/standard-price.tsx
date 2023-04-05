import { getStandardClientPrice } from '@src/apis/company-price.api'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { useQuery } from 'react-query'

export const useGetStandardPrices = () => {
  return useQuery<{ data: StandardPriceListType[]; totalCount: number }>(
    'standard-client-prices',
    () => getStandardClientPrice(),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,
    },
  )
}
