import axios from '@src/configs/axios'
import { OnboardingProDetailsType } from '@src/types/onboarding/details'

export const getProOverview = async (
  userId: number,
): Promise<OnboardingProDetailsType> => {
  const { data } = await axios.get<OnboardingProDetailsType>(
    `/api/enough/u/pro/${userId}/overview`,
  )

  return data
}
