import { getCompanyInfo } from '@src/apis/company/company-info.api'
import { useQuery } from 'react-query'

export const useGetCompanyInfo = () => {
  return useQuery('company-info', () => getCompanyInfo(), {
    staleTime: 60 * 1000, // 1

    suspense: true,
  })
}
