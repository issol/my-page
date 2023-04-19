import axios from 'src/configs/axios'
import { loginResType } from 'src/types/sign/signInTypes'
import { UserRoleType } from 'src/context/types'
import logger from '@src/@core/utils/logger'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { FilterType } from '@src/pages/client'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'
import { ClientAddressFormType } from '@src/types/schema/client-address.schema'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import { ClientDetailType } from '@src/types/client/client'

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
    // return {
    //   data: [
    //     {
    //       clientId: 1,
    //       corporationId: 'C-000001',
    //       name: 'testClient',
    //       email: 'test@Email.com',
    //       phone: '123-1234-1235',
    //       mobile: '123-1234-3455',
    //       fax: '000-9929-9344',
    //       websiteLink: 'https://test.io',
    //       status: 'New',
    //       timezone: {
    //         code: 'AD',
    //         label: 'Andorra',
    //         phone: '376',
    //       },
    //     },
    //     {
    //       clientId: 3,
    //       corporationId: 'C-000003',
    //       name: 'testClient2',
    //       email: 'test2@Email.com',
    //       phone: '123-1233-1244',
    //       mobile: '123-1234-3455',
    //       fax: '000-9929-9344',
    //       websiteLink: 'https://test2.io',
    //       status: 'New',
    //       timezone: {
    //         code: 'AL',
    //         label: 'Albania',
    //         phone: '355',
    //       },
    //     },
    //   ],
    //   count: 3,
    // }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type CreateClientBodyType = CompanyInfoFormType &
  ClientAddressFormType &
  ContactPersonType

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
