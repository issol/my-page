import { FilterType, getPriceUnitList } from '@src/apis/price-units.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetPriceUnitList = (filter: FilterType, search: boolean) => {
  return useQuery(
    'get-guideline/list',
    () => {
      return getPriceUnitList(filter)
    },
    {
      suspense: true,
      enabled: search,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
