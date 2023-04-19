import axios from 'src/configs/axios'
import logger from '@src/@core/utils/logger'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { FilterType } from '@src/pages/client'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'
import { ClientAddressFormType } from '@src/types/schema/client-address.schema'
import {
  ClientContactPersonType,
  ContactPersonType,
} from '@src/types/schema/client-contact-person.schema'
import { ClientDetailType, ClientMemoType } from '@src/types/client/client'

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

export type CreateClientResType = {
  adminCompanyName: string
  clientType: string
  name: string
  email: string
  phone: string | null
  mobile: string | null
  fax: string | null
  websiteLink: string | null
  timezone: CountryType
  corporationId: string
  status: string
  memo: string | null
  clientId: number
}

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
