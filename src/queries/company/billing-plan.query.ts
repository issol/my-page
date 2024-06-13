import { getCustomerPortalLink, getPaymentLink, getPlanList } from '@src/apis/company/billing-plan.api'
import { useQuery } from 'react-query'

export const useGetPlanList = () => {
  return useQuery('plan-list', () => getPlanList(), {
    staleTime: 60 * 1000, // 1

    suspense: true,
  })
}

export const useGetPaymentLink = (planId: string) => {
  return useQuery('payment-link', () => getPaymentLink(planId), {
    cacheTime: 0, // 캐시를 하지 않도록 설정
    staleTime: 0, // 데이터가 항상 stale 상태가 되도록 설정
    suspense: true,
  })
}

export const useGetCustomerPortalLink = () => {
  return useQuery('plan-list', () => getCustomerPortalLink(), {
    cacheTime: 0, // 캐시를 하지 않도록 설정
    staleTime: 0, // 데이터가 항상 stale 상태가 되도록 설정
    suspense: true,
  })
}