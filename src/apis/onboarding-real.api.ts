import { AxiosResponse } from 'axios'
import { log } from 'console'
import axios from 'src/configs/axios'
import { OnboardingProDetailsType } from 'src/types/onboarding/details'

export const getOnboardingProList = async () => {
  const data = await axios.get('/api/enough/onboard/user/al?take=20&skip=0')

  return data.data
}

export const getOnboardingProDetails = async (
  userId: string,
): Promise<OnboardingProDetailsType> => {
  const { data } = await axios.get<OnboardingProDetailsType>(
    `/api/enough/onboard/user/${userId}`,
  )

  return data
}

export const getResume = async () => {
  const data = await axios.get('/api/enough/resume')

  return data.data.url
}

export const addCommentOnPro = async (userId: number, comment: string) => {
  await axios.post(`/api/enough/u/comment`, {
    userId: userId,
    comment: comment,
  })
}
