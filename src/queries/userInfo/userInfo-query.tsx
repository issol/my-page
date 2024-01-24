import { useQuery } from 'react-query'
import {
  getDeleteAccountReasonList,
  getIsDeletableAccount,
  getProDetails,
  getUserInfo,
} from '@src/apis/user.api'

export const useGetUserInfoWithResume = (
  userId: string | string[] | undefined,
) => {
  const id = typeof userId === 'string' && userId ? parseInt(userId) : 0
  return useQuery(`${userId}`, () => getProDetails(id!), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    useErrorBoundary: true,
    suspense: true,
  })
}

export const useGetProfile = (userId: number) => {
  return useQuery(`profile-${userId}`, () => getUserInfo(userId), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    useErrorBoundary: true,
    select: data => ({
      ...data,
      id: userId,
    }),
  })
}

export const useGetDeleteAccountReasonList = () => {
  return useQuery(
    `deleteAccountReasonList`,
    () => getDeleteAccountReasonList(),
    {
      suspense: true,
      useErrorBoundary: true,
      keepPreviousData: true,
      staleTime: 60 * 1000, // 1
    },
  )
}
