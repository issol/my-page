import axios from '@src/configs/axios'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { OnboardingProDetailsType } from '@src/types/onboarding/details'

export const getProOverview = async (
  userId: number,
): Promise<DetailUserType> => {
  const { data } = await axios.get<DetailUserType>(
    `/api/enough/u/pro/${userId}/overview`,
  )

  return data
}

export const getProWorkDays = async (userId: number, year: number) => {
  const { data } = await axios.get(
    `/api/enough/u/pro/${userId}/work-days?year=${year}`,
  )

  return data
}

export const changeProStatus = async (userId: number, status: string) => {
  await axios.patch(`/api/enough/u/pro/${userId}/status`, { status: status })
}
