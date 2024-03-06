import {
  getJobTemplateDetail,
  getJobTemplateList,
} from '@src/apis/jobs/job-template.api'
import { JobListFilterType } from '@src/types/jobs/job-template.type'
import { useQuery } from 'react-query'

export const useGetJobTemplate = (filter: JobListFilterType) => {
  return useQuery(
    ['jobTemplateList', filter],
    () => getJobTemplateList(filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: false,
      keepPreviousData: true,
    },
  )
}

export const useGetJobTemplateDetail = (id: number, enabled: boolean) => {
  return useQuery([`jobTemplateDetail`, id], () => getJobTemplateDetail(id), {
    enabled: enabled,
    staleTime: 60 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
  })
}
