import { getUnitOptions } from '@src/apis/options.api'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetUnitOptions = () => {
  return useQuery(['options/unit'], () => getUnitOptions(), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
    select(data) {
      return data.map(({ id, name, isAvailable }) => ({
        id,
        name,
        isAvailable,
      }))
    },
  })
}
