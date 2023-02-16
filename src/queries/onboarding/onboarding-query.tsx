import { useQuery } from 'react-query'
import { getReviewer } from 'src/apis/onboarding.api'
import { getOnboardingProList } from 'src/apis/onboarding-real.api'
import { OnboardingListType } from 'src/types/onboarding/list'

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

export const useGetOnboardingProList = () => {
  return useQuery<{ data: OnboardingListType[]; totalCount: number }>(
    'onboarding-pro-list',
    () => {
      return getOnboardingProList()
    },
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
