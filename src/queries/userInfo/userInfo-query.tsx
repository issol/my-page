import { useQuery } from 'react-query'
import { getUserInfoWithResumeFile } from 'src/apis/user.api'

export const useGetUserInfoWithResume = (userId: number) => {
  return useQuery('members', () => getUserInfoWithResumeFile(userId), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: true,

    //   select: (data: ResponseMembersType[]) => {
    //     return data.map((value: ResponseMembersType) => ({
    //       id: value.userId,
    //       role: value.permissionGroups,
    //       permission: value.type ?? 'General',
    //       email: value.email,
    //       firstName: value.firstName ?? '-',
    //       middleName: value.middleName ?? '',
    //       lastName: value.lastName ?? '-',
    //       updatedAt: value.updatedAt,
    //       createdAt: value.createdAt,
    //       jobTitle: value.jobTitle,
    //     }))
    //   },
    // onSuccess: () => {
    //   setSearch(false)
    // },
  })
}
