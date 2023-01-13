import { AnyAbility } from '@casl/ability'
import { useQuery } from 'react-query'
import { getMembers, getSignUpRequests } from 'src/apis/company.api'

export const useGetSignUpRequests = (ability: boolean) => {
  return useQuery('signup-requests', () => getSignUpRequests(), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: true,
    enabled: ability,
    // onSuccess: () => {
    //   setSearch(false)
    // },
  })
}

export const useGetMembers = () => {
  return useQuery('members', () => getMembers(), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: true,

    // select: data => {
    //   return data.map((value: any) => ({ ...value, id: value.userId }))
    // },
    // onSuccess: () => {
    //   setSearch(false)
    // },
  })
}
