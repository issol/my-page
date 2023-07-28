import { useQuery } from 'react-query'
import {
  getIsDeletableAccount,
  getProDetails,
  getUserInfo,
} from 'src/apis/user.api'

export const useGetUserInfoWithResume = (
  userId: string | string[] | undefined,
) => {
  const id = typeof userId === 'string' && userId ? parseInt(userId) : 0
  return useQuery(`${userId}`, () => getProDetails(id!), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: true,
  })
}

export const useGetProfile = (userId: number) => {
  return useQuery(`profile-${userId}`, () => getUserInfo(userId), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    select: data => ({
      ...data,
      id: userId,
    }),
  })
}
