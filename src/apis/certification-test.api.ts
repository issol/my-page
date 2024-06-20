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
  const data = await axios.get(
    `/api/enough/cert/test/paper/created-check?${makeQuery(filters)}`,
  )
  return data.data
}

export interface TestFormType {
  writer: string
  email: string
  testType: string
  source?: Array<string>
  target: Array<string>
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
    if (e.response.data.errorCode === 'MalformedURL') throw 'MalformedURL'
    else if (e.response.data.errorCode === 'UrlPermission')
      throw 'UrlPermission'
    else throw new Error(e)
  }
}

export const getTestDetail = async (id: number): Promise<TestDetailType> => {
  const { data } = await axios.get(`/api/enough/cert/test/paper/${id}`)
  return data
}

export const patchTest = async (
  id: number,
  form: PatchFormType,
): Promise<{ id: number }> => {
  const { data } = await axios.patch(`/api/enough/cert/test/paper/${id}`, form)
  return data
}

export const deleteTest = async (id: number) => {
  await axios.delete(`/api/enough/cert/test/paper/${id}`)
}

export const deleteTestFile = async (fileId: number) => {
  return await axios.delete(`/api/enough/cert/test/paper/file/${fileId}`)
}
