import { toast } from 'react-hot-toast'
import { QueryFunction, useQuery } from 'react-query'
import {
  getGuidelineDetail,
  getGuidelines,
} from 'src/apis/client-guideline.api'
import { FilterType } from 'src/pages/onboarding/client-guideline'

export const useGetGuideLines = (
  filter: FilterType,
  search: boolean,
  setSearch: (v: boolean) => void,
) => {
  return useQuery(
    'get-guideline/list',
    () => {
      return getGuidelines(filter)
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

export const useGetGuideLineDetail = (id: number) => {
  return useQuery(
    'get-guideline/detail',
    () => {
      return getGuidelineDetail(id)
    },
    {
      suspense: true,
      // onSuccess: () => setSearch(false),
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
