import axios from 'src/configs/axios'
import logger from '@src/@core/utils/logger'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { FilterType } from '@src/pages/client'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'
import {
  ClientAddressFormType,
  ClientAddressType,
} from '@src/types/schema/client-address.schema'
import {
  ClientContactPersonType,
  ContactPersonType,
} from '@src/types/schema/client-contact-person.schema'
import {
  ClientDetailType,
  ClientMemoPostType,
  ClientMemoType,
  CreateClientResType,
  CreateContactPersonFormType,
} from '@src/types/client/client'
import {
  ClientProjectFilterType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'

export type StatusType = 'New' | 'Active' | 'Inactive' | 'Contacted' | 'Blocked'
export type ClientRowType = {
  corporationId: string
  clientId: number
  name: string
  email: string
  status: StatusType
  timezone: CountryType
  mobile?: string | null
  phone?: string | null
  fax?: string | null
  websiteLink?: string
}

export type ClientListDataType = {
  data: Array<ClientRowType>
  count: number
}

export const getClientList = async (
  filters: FilterType,
): Promise<ClientListDataType> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/al?${makeQuery(filters)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type CreateClientBodyType = CompanyInfoFormType &
  ClientAddressFormType &
  ClientContactPersonType

export const createClient = async (
  form: CreateClientBodyType,
): Promise<CreateClientResType> => {
  try {
    const { data } = await axios.post(`/api/enough/u/client`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getClientDetail = async (
  id: number,
): Promise<ClientDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/client/${id}/profile`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getClientMemo = async (
  clientId: number,
  filters: { skip?: number; take: number },
): Promise<{ data: Array<ClientMemoType>; count: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/memo?clientId=${clientId}&${makeQuery(filters)}`,
    )
    return data
  } catch (e: any) {
    return { data: [], count: 0 }
  }
}

export type updateClientInfoType = Omit<CompanyInfoFormType, 'memo'>
export const updateClientInfo = async (
  clientId: number,
  body: updateClientInfoType,
): Promise<CreateClientResType> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/client/${clientId}`, body)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateClientStatus = async (
  clientId: number,
  body: { status: string },
): Promise<CreateClientResType> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/client/${clientId}`, body)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

/** TODO : request body수정 가능성 있음 */
export const updateClientAddress = async (
  clientId: number,
  body: ClientAddressType,
): Promise<CreateClientResType> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/client/address/${clientId}`,
      body,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateContactPerson = async (
  contactPersonId: number,
  body: ContactPersonType,
): Promise<ContactPersonType> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/contact-person/${contactPersonId}`,
      body,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const createContactPerson = async (
  body: Array<CreateContactPersonFormType>,
): Promise<ContactPersonType> => {
  try {
    const { data } = await axios.post(`/api/enough/u/contact-person`, {
      data: body,
    })
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteContactPerson = async (
  contactPersonId: number,
): Promise<ContactPersonType> => {
  try {
    const { data } = await axios.delete(
      `/api/enough/u/contact-person/${contactPersonId}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const createClientMemo = async (
  contactPersonId: number,
  body: ClientMemoPostType,
): Promise<ContactPersonType> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/contact-person/${contactPersonId}`,
      body,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateClientMemo = async (body: {
  memoId: number
  memo: string
}): Promise<ClientMemoType> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/client/memo`, body)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteClientMemo = async (
  memoId: number,
): Promise<ClientMemoType> => {
  try {
    const { data } = await axios.delete(`/api/enough/u/client/memo/${memoId}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getClientProjectList = async (
  filter: ClientProjectFilterType,
): Promise<{ data: ClientProjectListType[]; totalCount: number }> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/client/projects?${makeQuery(filter)}`,
    // )

    const list = [
      {
        id: 0,
        qId: 'Q-000001',
        workName: 'The Glory',
        projectName: 'The Glory 1~2',
        category: 'Webcomics',
        serviceType: ['Translation', 'Proofreading'],
        dueDate: '2022-04-27T14:13:15Z',
        status: 'Active',
        orderDate: '2022-04-20T14:13:15Z',
        projectDescription: 'Test',
      },
      {
        id: 1,
        qId: 'O-000001',
        workName: 'Dark Night',
        projectName: 'Dark Night 1~2',
        category: 'Webcomics',
        serviceType: ['Translation', 'Proofreading'],
        dueDate: '2022-04-28T14:13:15Z',
        status: 'Active',
        orderDate: '2022-04-20T14:13:15Z',
        projectDescription: 'Test2',
      },
    ]
    // return data
    return {
      data: list,
      totalCount: list.length,
    }
  } catch (e: any) {
    throw new Error(e)
  }
}
