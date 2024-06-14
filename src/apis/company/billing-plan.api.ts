import axios from '@src/configs/axios'

export const getPaymentLink = async (planId: string) => {
  const { data } = await axios.post(`/api/enough/u/payment`, { planId })

  return data
}

export const getCustomerPortalLink = async (option: string) => {
  const { data } = await axios.get(`/api/enough/u/payment/customer-portal?option=${option}`)
  return data
}
