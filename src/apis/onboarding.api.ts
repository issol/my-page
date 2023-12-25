import axios from 'src/configs/axios'

import { OnboardingProDetailsType } from 'src/types/onboarding/details'
import {
  AddRolePayloadType,
  AddRoleType,
  CheckDuplicateType,
  OnboardingFilterType,
} from 'src/types/onboarding/list'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { DetailUserType } from '@src/types/common/detail-user.type'

export const getOnboardingProList = async (filters: OnboardingFilterType) => {
  const data = await axios.get(
    `/api/enough/onboard/user/al?${makeQuery(filters)}`,
  )

  return data.data
}

export const getOnboardingProDetails = async (
  userId: number,
): Promise<DetailUserType> => {
  const { data } = await axios.get<DetailUserType>(
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

  // console.log(data)

  return data.data
}

export const addCreatedAppliedRole = async (payload: AddRolePayloadType[]) => {
  await axios.post('/api/enough/cert/request/role/generate', { data: payload })
}

export const addCreateProAppliedRole = async (
  payload: AddRolePayloadType[],
) => {
  await axios.post('/api/enough/cert/request/role-and-test', { data: payload })
  // return Promise.resolve()
}

export const addCreateProAppliedTest = async (
  payload: AddRolePayloadType[],
) => {
  await axios.post('/api/enough/cert/request/role', { data: payload })
  // return Promise.resolve()
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

  await axios.patch(`/api/enough/cert/request/role/${id}`, params)
}

export const patchTestStatus = async (id: number, status: string) => {
  const params = { status }

  await axios.patch(`/api/enough/cert/test/${id}`, params)
}

export const getCertifiedRole = async (id: number) => {
  const data = await axios.get(`/api/enough/cert/certificate?userId=${id}`)

  return data.data
}

export const setCertifiedRole = async (payload: AddRolePayloadType[]) => {
  await axios.post(`/api/enough/cert/certificate`, { data: payload })
}

export const getReviewer = async (testId: number) => {
  const data = await axios.get(
    `/api/enough/cert/request/review/candidate/list?testId=${testId}`,
  )

  return data.data
}

export const getHistory = async (testId: number) => {
  const data = await axios.get(`/api/enough/cert/test/history/${testId}`)
  return data.data
}

export const assignReviewer = async (
  reviewerId: number,
  testId: number,
  status: string,
) => {
  const data = await axios.patch('/api/enough/cert/request/review/reply', {
    reviewerId: reviewerId,
    testId: testId,
    reply: status,
  })

  return data
}

export const requestReviewer = async (testId: number, reviewerId: number) => {
  const data = await axios.post('/api/enough/cert/request/review', {
    reviewerId: reviewerId,
    testId: testId,
  })

  return data
}

export const cancelReviewer = async (testId: number) => {
  const data = await axios.patch('/api/enough/cert/request/review/reassign', {
    testId: testId,
  })

  return data
}

export const checkDuplicate = async (
  payload: CheckDuplicateType,
): Promise<{ code: number }> => {
  const { data } = await axios.get(
    `/api/enough/cert/request/check-duplicate?${makeQuery(payload)}`,
  )

  return data
}
