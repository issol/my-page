import { useQuery } from 'react-query'
import { getReviewer } from 'src/apis/onboarding.api'

export const useGetReviewerList = () => {
  return useQuery(
    'reviewers',
    () => {
      return getReviewer()
    },
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
