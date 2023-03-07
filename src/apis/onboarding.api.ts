import axios from 'src/configs/axios'
import axiosDefault from 'axios'
import { OnboardingProDetailsType } from 'src/types/onboarding/details'
import {
  AddRolePayloadType,
  OnboardingFilterType,
} from 'src/types/onboarding/list'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getOnboardingProList = async (filters: OnboardingFilterType) => {
  const data = await axios.get(
    `/api/enough/onboard/user/al?${makeQuery(filters)}`,
  )

  console.log(data)

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

export const editCommentOnPro = async (commentId: number, comment: string) => {
  await axios.patch('/api/enough/u/comment', {
    commentId: commentId,
    comment: comment,
  })
}

export const deleteCommentOnPro = async (commentId: number) => {
  await axios.delete(`/api/enough/u/comment/${commentId}`)
}

export const getOnboardingStatistic = async () => {
  const data = await axios.get('/api/enough/cert/statistic')

  return data.data
}

export const getStatistic = async () => {
  const data = await axios.get('/api/enough/u/statistic/today')

  return data.data
}

export const getAppliedRole = async (id: number) => {
  const data = await axios.get(`/api/enough/cert/request/role?userId=${id}`)

  return data.data
}

export const addCreatedAppliedRole = async (payload: AddRolePayloadType[]) => {
  await axios.post('/api/enough/cert/request/role/generate', { data: payload })
}

export const patchAppliedRole = async (
  id: number,
  reply: string,
  reason?: string,
  messageToUser?: string,
) => {
  const params = {
    reply,
    reason,
    messageToUser,
  }

  console.log(params)

  await axios.patch(`/api/enough/cert/request/role/${id}`, params)
}

export const patchTestStatus = async (id: number, status: string) => {
  const params = { status }

  await axios.patch(`/api/enough/cert/test/${id}`)
}

export const getCertifiedRole = async (id: number) => {
  const data = await axios.get(`/api/enough/cert/certificate?userId=${id}`)

  return data.data
}

export const getReviewer = async () => {
  const data = await axiosDefault.get('/api/pro/details/reviewer')

  return data.data
}

export const getHistory = async () => {
  const data = await axiosDefault.get('/api/pro/details/history')
  return data.data
}

export const assignReviewer = async (id: number, status: string) => {
  try {
    const data = await axiosDefault.post('/api/pro/details/reviewer/action', {
      data: { id: id, status: status },
    })

    return data
  } catch (e) {}
}
