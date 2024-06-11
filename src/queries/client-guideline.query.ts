import { toast } from 'react-hot-toast'
import { QueryFunction, useQuery } from 'react-query'
import {
  getGuidelineDetail,
  getGuidelines,
} from 'src/apis/client-guideline.api'
import { FilterType } from 'src/pages/[companyName]/onboarding/client-guideline'

export const useGetGuideLines = (filter: FilterType) => {
  return useQuery(['get-guideline', filter], () => getGuidelines(filter), {
    staleTime: 60 * 1000,
    keepPreviousData: true,
    suspense: true,
  })
}

export const useGetGuideLineDetail = (id: number) => {
  return useQuery(
    ['get-guideline/detail'],
    () => {
      return getGuidelineDetail(id)
    },
    {
      enabled: false,
      suspense: true,
      useErrorBoundary: false,
      onError: (e: any) => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
        return e
      },
    },
  )
}
