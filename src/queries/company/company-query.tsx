import { useQuery } from 'react-query'
import { getSignUpRequests } from 'src/apis/company.api'

export const useGetSignUpRequests = () => {
  return useQuery(['signup-requests'], () => getSignUpRequests(), {
    staleTime: 60 * 1000, // 1
    keepPreviousData: true,
    suspense: true,
    // onSuccess: () => {
    //   setSearch(false)
    // },
  })
}
