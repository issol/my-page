import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  JobListFilterType,
  JobTemplateDetailType,
  JobTemplateFormType,
  JobTemplateListType,
} from '@src/types/jobs/job-template.type'

export const getJobTemplateList = async (
  filter: JobListFilterType,
): Promise<{
  data: Array<JobTemplateListType>
  totalCount: number
  count: number
}> => {
  const { data } = await axios.get(
    `/api/enough/u/job-template/list?${makeQuery(filter)}`,
  )
  // const res: {
  //   data: Array<JobTemplateListType>
  //   totalCount: number
  //   count: number
  // } = {
  //   data: [
  //     {
  //       id: 4,
  //       name: 'Test Name 4',
  //       corporationId: 'JT-000007',
  //       authorId: 5,
  //       options: [
  //         {
  //           id: 10,
  //           serviceTypeId: 1,
  //           order: 0,
  //           autoNextJob: true,
  //           statusCodeForAutoNextJob: 60002,
  //           autoSharingFile: true,
  //         },
  //         {
  //           id: 11,
  //           serviceTypeId: 7,
  //           order: 1,
  //           autoNextJob: true,
  //           statusCodeForAutoNextJob: 60002,
  //           autoSharingFile: true,
  //         },
  //         {
  //           id: 12,
  //           serviceTypeId: 12,
  //           order: 2,
  //           autoNextJob: false,
  //           statusCodeForAutoNextJob: 60002,
  //           autoSharingFile: false,
  //         },
  //       ],
  //     },
  //   ],
  //   count: 123,
  //   totalCount: 1,
  // }

  // return res
  return data
}

export const createJobTemplate = async (params: JobTemplateFormType) => {
  const { data } = await axios.post(`/api/enough/u/job-template`, params)
  return data
}

export const editJobTemplate = async (
  id: number,
  params: JobTemplateFormType,
) => {
  const { data } = await axios.put(`/api/enough/u/job-template/${id}`, params)
  return data
}

export const getJobTemplateDetail = async (
  id: number,
): Promise<JobTemplateDetailType> => {
  const { data } = await axios.get(`/api/enough/u/job-template/${id}`)
  return data
}

export const deleteJobTemplate = async (id: number) => {
  await axios.delete(`/api/enough/u/job-template/${id}`)
}
