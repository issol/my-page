import axios from 'src/configs/axios'
import {
  BasicTestExistencePayloadType,
  TestMaterialFilterPayloadType,
} from 'src/types/certification-test/list'
import { makeQuery } from 'src/shared/transformer/query.transformer'

import { TestDetailType } from 'src/types/certification-test/detail'
import { FilePostType } from './client-guideline.api'

export const getTestMaterialList = async (
  filters: TestMaterialFilterPayloadType,
) => {
  const data = await axios.get(
    `/api/enough/cert/test/paper?${makeQuery(filters)}`,
  )

  return data.data
}

export const checkBasicTestExistence = async (
  filters: BasicTestExistencePayloadType,
): Promise<boolean> => {
  try {
    const data = await axios.get(
      `/api/enough/cert/test/paper/created-check?${makeQuery(filters)}`,
    )
    return data.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export interface TestFormType {
  company: string
  writer: string
  email: string
  testType: string
  source?: string
  target: string
  jobType?: string
  role?: string
  testPaperFormUrl: string
  content: any
  text: string
  files?: Array<{ name: string; size: number; fileKey: string }>
}

export type PatchFormType = Omit<
  TestFormType,
  'company' | 'testType' | 'source' | 'target' | 'jobType' | 'role'
>

export const postTest = async (form: TestFormType): Promise<{ id: number }> => {
  try {
    const { data } = await axios.post(`/api/enough/cert/test/paper`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getTestUploadPreSignedUrl = async (
  path: string[],
): Promise<Array<string>> => {
  try {
    const { data } = await axios.post(
      `/api/enough/cert/test/paper/upload-file`,
      {
        path,
      },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getTestDownloadPreSignedUrl = async (
  path: string[],
): Promise<Array<string>> => {
  try {
    const { data } = await axios.post(
      `/api/enough/cert/test/paper/download-file`,
      {
        path,
      },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getTestDetail = async (id: number): Promise<TestDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/cert/test/paper/${id}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const patchTest = async (
  id: number,
  form: PatchFormType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/cert/test/paper/${id}`,
      form,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteTest = async (id: number) => {
  try {
    await axios.delete(`/api/enough/cert/test/paper/${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
