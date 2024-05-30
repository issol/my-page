import axios from '@src/configs/axios'
import { PlanListType } from '@src/types/company/billing-plan'
import {
  CompanyAddressParamsType,
  CompanyInfoParamsType,
  CompanyInfoType,
} from '@src/types/company/info'

export const getPlanList = async (): Promise<PlanListType[]> => {
  const { data } = await axios.get(`/api/enough/u/plan`)

  return data
}

export const getPaymentLink = async (planId: string) => {
  const { data } = await axios.post(`/api/enough/u/payment`, { planId })

  return data
}

export const getCustomerPortalLink = async () => {
  const { data } = await axios.get(`/api/enough/u/payment/customer-portal`)
  return data
}
