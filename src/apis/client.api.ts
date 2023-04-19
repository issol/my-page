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
} from '@src/types/client/client'

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
