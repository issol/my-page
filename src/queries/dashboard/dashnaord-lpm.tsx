import { useQuery } from 'react-query'

import { getReport } from '@src/apis/dashboard/lpm'
import type { DashboardQuery } from '@src/types/dashboard'

export const useDashboardReport = (query: DashboardQuery) => {
  return useQuery(
    ['client-detail'],
    () => {
      return getReport(query)
    },
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
