import { AnyAbility } from '@casl/ability'
import { useQuery } from 'react-query'
import { getMembers, getSignUpRequests } from 'src/apis/company.api'
import {
  ResponseMembersType,
  ResponseRequestsType,
  SignUpRequestsType,
} from 'src/types/company/members'

export const useGetSignUpRequests = (ability: boolean) => {
  return useQuery(
    'signup-requests',
    () => {
      return getSignUpRequests()
    },
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,
      enabled: ability,

      select: (data: ResponseRequestsType[]) => {
        return data.map((value: ResponseRequestsType) => ({
          id: value.userId,
          email: value.email,
          role: value.roles,
          permission: 'General',
        }))
      },
      // onSuccess: () => {
      //   setSearch(false)
      // },
    },
  )
}

export const useGetMembers = () => {
  return useQuery('members', () => getMembers(), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: true,

    select: (data: ResponseMembersType[]) => {
      return data.map((value: ResponseMembersType) => ({
        id: value.userId,
        role: value.permissionGroups,
        permission: value.type,
        email: value.email,
        firstName: value.firstName,
        middleName: value.middleName ?? '',
        lastName: value.lastName,
        updatedAt: value.updatedAt,
        createdAt: value.createdAt,
        jobTitle: value.jobTitle,
      }))
    },
    // onSuccess: () => {
    //   setSearch(false)
    // },
  })
}
