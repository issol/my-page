import { getRecruitingList, getRecruitingCount } from './../apis/recruiting.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { FilterType } from 'src/pages/recruiting'

export const useGetRecruitingCount = () => {
  return useQuery(
    'get-recruiting/count',
    () => {
      return getRecruitingCount()
    },
    {
      suspense: true,
    },
  )
}
export const useGetRecruitingList = (
  filter: FilterType,
  search: boolean,
  setSearch: (v: boolean) => void,
) => {
  return useQuery(
    'get-recruiting/list',
    () => {
      return getRecruitingList(filter)
    },
    {
      suspense: true,
      enabled: search,
      onSuccess: () => setSearch(false),
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
