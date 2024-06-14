import { useQuery } from 'react-query'
import { getSeats } from '@src/apis/company/company-seats.api'

export const useGetSeats = () => {
  return useQuery('seats', () => getSeats(), {
    cacheTime: 0, // 캐시를 하지 않도록 설정
    staleTime: 0, // 데이터가 항상 stale 상태가 되도록 설정
    suspense: true,
  })
}