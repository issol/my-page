import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export enum ContractTypeEnum {
  NDA = 'NDA',
  PRIVACY = 'PRIVACY',
  FREELANCER = 'FREELANCER',
}
export enum ContractLangEnum {
  KOREAN = 'KOR',
  ENGLISH = 'ENG',
}

export type ContractType = 'NDA' | 'PRIVACY' | 'FREELANCER' | ''
export type LangType = 'KOR' | 'ENG' | ''
export type ContractParam = {
  type: ContractType
  language: LangType
}

export type currentVersionType = {
  documentId: number
  userId: number
  title: string
  email: string
  writer: string
  updatedAt: string
  content: any
}
export type ContractDetailType = {
  currentVersion: currentVersionType
  versionHistory: Array<{
    documentId: number
    userId: number
    version: string
    writer: string
    email: string
    updatedAt: string
    content: any
  }>
}

export const getContractDetail = async (
  props: ContractParam,
): Promise<ContractDetailType> => {
  const { data } = await axios.get(
    `/api/enough/onboard/contract?type=${props.type}&language=${props.language}`,
  )
  return data
}

export type ContractFormType = {
  type: ContractType
  language: LangType
  title: string
  writer: string
  email: string
  content: any
  text: string
}

export const postContract = async (param: ContractFormType) => {
  return await axios.post(`/api/enough/onboard/contract`, param)
}

export type ContractUpdateFormType = Omit<
  ContractFormType,
  'type' | 'language' | 'title'
>

export const updateContract = async (
  documentId: number,
  param: ContractUpdateFormType,
) => {
  return await axios.put(`/api/enough/onboard/contract/${documentId}`, param)
}

export const deleteContract = async (
  type: ContractType,
  language: LangType,
) => {
  return await axios.delete(`/api/enough/onboard/contract`, {
    data: { type, language },
  })
}

export const restoreContract = async (
  documentId: number,
  writer: string,
  email: string,
) => {
  return await axios.post(
    `/api/enough/onboard/contract/restore/${documentId}`,
    { writer, email },
  )
}
