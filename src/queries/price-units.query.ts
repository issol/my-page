import { FilterType, getPriceUnitList } from '@src/apis/price-units.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetPriceUnitList = (filter: FilterType) => {
  return useQuery(
    'get-guideline/list',
    () => {
      return getPriceUnitList(filter)
    },
    {
      suspense: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
