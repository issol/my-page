import { useQuery } from 'react-query'
import { getProDetails } from 'src/apis/user.api'

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
