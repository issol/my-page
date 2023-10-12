import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/onboarding/client-guideline'
import { FileType } from 'src/types/common/file.type'

export type FilePostType = { name: string; size: number; fileUrl: string }
export const getGuidelines = async (
  filters: FilterType,
): Promise<{
  data:
    | Array<{
        id: number
        version: number
        title: string
        client: string
        category: string
        serviceType: string
        createdAt: string
      }>
    | []
  count: number
  totalCount: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/onboard/guideline?${makeQuery(filters)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

export type CurrentGuidelineType = {
  id: number
  version?: number
  userId: number
  title: string
  writer: string
  email: string
  client: string
  category: string
  serviceType: string
  updatedAt: string
  content: any
  files: Array<FileType>
}

export type GuideDetailType = {
  currentVersion: CurrentGuidelineType
  versionHistory: Array<CurrentGuidelineType>
}
export const getGuidelineDetail = async (
  id: number,
): Promise<GuideDetailType> => {
  const { data } = await axios.get(`/api/enough/onboard/guideline/${id}`)
  return data
}

export const checkGuidelineExistence = async (
  client: string,
  category: string,
  serviceType: string,
): Promise<boolean> => {
  const { data } = await axios.get(
    `/api/enough/onboard/guideline/created-check?client=${client}&category=${category}&serviceType=${serviceType}`,
  )
  return data
}

export type FormType = {
  writer: string
  email: string
  title: string
  client: string
  category: string
  serviceType: string
  content: any
  text: string
  files?: Array<FilePostType>
}

export const postGuideline = async (
  form: FormType,
): Promise<{ id: number }> => {
  const { data } = await axios.post(`/api/enough/onboard/guideline`, form)
  return data
}

export const updateGuideline = async (
  id: number,
  form: FormType,
): Promise<{ id: number }> => {
  const { data } = await axios.patch(
    `/api/enough/onboard/guideline/${id}`,
    form,
  )
  return data
}

export const uploadGuidelineFiles = async (id: number, fileName: string) => {
  return await axios.post(
    `/api/enough/a/r-req/al?type=${id}&fileName=${fileName}`,
  )
}

export const deleteGuidelineFile = async (fileId: number) => {
  return await axios.delete(`/api/enough/onboard/guideline/file/${fileId}`)
}

export const deleteGuideline = async (guidelineId: number) => {
  return await axios.delete(`/api/enough/onboard/guideline/${guidelineId}`)
}

export const restoreGuideline = async (
  id: number,
  writer: string,
  email: string,
) => {
  return await axios.post(`/api/enough/onboard/guideline/restore/${id}`, {
    writer,
    email,
  })
}
