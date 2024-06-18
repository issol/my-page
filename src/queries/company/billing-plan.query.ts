import { getCustomerPortalLink, getPaymentLink } from '@src/apis/company/billing-plan.api'
import { useQuery } from 'react-query'

export const useGetPaymentLink = (planId: string) => {
  return useQuery('payment-link', () => getPaymentLink(planId), {
    cacheTime: 0, // 캐시를 하지 않도록 설정
    staleTime: 0, // 데이터가 항상 stale 상태가 되도록 설정
    suspense: true,
  })
}

export const useGetCustomerPortalLink = (option: string) => {
  return useQuery('plan-list', () => getCustomerPortalLink(option), {
    cacheTime: 0, // 캐시를 하지 않도록 설정
    staleTime: 0, // 데이터가 항상 stale 상태가 되도록 설정
    suspense: true,
  })
}