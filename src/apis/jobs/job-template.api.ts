import axios from '@src/configs/axios'
import {
  JobListFilterType,
  JobTemplateListType,
} from '@src/types/jobs/job-template.type'

export const getJobTemplateList = async (
  filter: JobListFilterType,
): Promise<{
  data: Array<JobTemplateListType>
  totalCount: number
  count: number
}> => {
  // const { data } = await axios.get('/api/enough/u/job-template/list')
  const res: {
    data: Array<JobTemplateListType>
    totalCount: number
    count: number
  } = {
    data: [
      {
        id: 4,
        name: 'Test Name 4',
        corporationId: 'JT-000007',
        authorId: 5,
        options: [
          {
            id: 10,
            serviceTypeId: 1,
            order: 0,
            autoNextJob: true,
            statusCodeForAutoNextJob: 60002,
            autoSharingFile: true,
          },
          {
            id: 11,
            serviceTypeId: 7,
            order: 1,
            autoNextJob: true,
            statusCodeForAutoNextJob: 60002,
            autoSharingFile: true,
          },
          {
            id: 12,
            serviceTypeId: 12,
            order: 2,
            autoNextJob: false,
            statusCodeForAutoNextJob: 60002,
            autoSharingFile: false,
          },
        ],
      },
    ],
    count: 123,
    totalCount: 1,
  }
  // const { data } = isHistory
  //   ? await axios.get(`/api/enough/u/job/history/${id}/price`)
  //   : await axios.get(`/api/enough/u/job/${id}/price`)

  return res
}
