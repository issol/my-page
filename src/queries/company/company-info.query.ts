import { getCompanyInfo } from '@src/apis/company/company-info.api'
import { useQuery } from 'react-query'

export const useGetCompanyInfo = (name: string) => {
  return useQuery('company-info', () => getCompanyInfo(name), {
    staleTime: 60 * 1000, // 1

    suspense: true,
  })
}
