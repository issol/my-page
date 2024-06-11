import axios from 'src/configs/axios'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { FilterType } from 'src/pages/[companyName]/client'
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
  CreateWorkNameType,
  WorkNameResType,
} from '@src/types/client/client'
import {
  ClientInvoiceFilterType,
  ClientInvoiceListType,
  ClientProjectFilterType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'
import { CorporateClientInfoType } from '@src/context/types'
import {
  getOrderStatusColor,
  getQuoteStatusColor,
  getReceivableStatusColor,
} from '@src/shared/helpers/colors.helper'

import { FileType } from '@src/types/common/file.type'
import {
  OrderLabel,
  OrderStatus,
  QuotesStatus,
} from '@src/types/common/status.type'

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
  tax: string | null
  isTaxable: boolean
}

export type ClientListDataType = {
  data: Array<ClientRowType>
  count: number
  totalCount: number
}

export const getClientList = async (
  filters: FilterType,
): Promise<ClientListDataType> => {
  try {
    const { data } = await axios.get(
      // `/api/enough/u/client/al?${makeQuery(filters)}`,
      `/api/enough/u/client/guideline/al?${makeQuery(filters)}`,
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

export type CreateClientBodyType = CompanyInfoFormType &
  ClientAddressFormType &
  ClientContactPersonType &
  CorporateClientInfoType

export const createClient = async (
  form: CreateClientBodyType,
): Promise<CreateClientResType> => {
  const { data } = await axios.post(`/api/enough/u/client`, form)
  return data
}

export const updateClient = async (
  clientId: number,
  form: CreateClientBodyType,
): Promise<CreateClientResType> => {
  const { data } = await axios.patch(`/api/enough/u/client/${clientId}`, form)
  return data
}

export const createNotesToClient = async (clientId: number, note: string) => {
  await axios.post(`/api/enough/u/client/payment-info/notes`, {
    clientId,
    note,
  })
}

export const createNotesToClientFiles = async (
  clientId: number,
  files: FileType[],
) => {
  await axios.post(`/api/enough/u/client/payment-info/notes/file`, {
    clientId,
    files,
  })
}

export const getClientDetail = async (
  id: number,
): Promise<ClientDetailType> => {
  const { data } = await axios.get(`/api/enough/u/client/${id}/profile`)
  return data
}

export const getClientMemo = async (
  clientId: number,
  filters: { skip?: number; take: number },
): Promise<{ data: Array<ClientMemoType>; count: number }> => {
  const { data } = await axios.get(
    `/api/enough/u/client/memo?clientId=${clientId}&${makeQuery(filters)}`,
  )
  return data
}

export const getClientNotes = async (
  clientId: number,
): Promise<{ id?: number; note: string | null; file: Array<FileType> }> => {
  const { data } = await axios.get(
    `/api/enough/u/client/payment-info/notes?clientId=${clientId}`,
  )
  return data
}

export type updateClientInfoType = Omit<CompanyInfoFormType, 'memo'>
export const updateClientInfo = async (
  clientId: number,
  body: updateClientInfoType,
): Promise<CreateClientResType> => {
  const { data } = await axios.patch(`/api/enough/u/client/${clientId}`, body)
  return data
}

export const updateNotesToClient = async (
  clientId: number,
  note: string | null,
) => {
  await axios.patch(`/api/enough/u/client/payment-info/notes`, {
    clientId,
    note,
  })
}

export const updateClientStatus = async (
  clientId: number,
  body: { status: string },
): Promise<CreateClientResType> => {
  const { data } = await axios.patch(`/api/enough/u/client/${clientId}`, body)
  return data
}

export const updateClientAddress = async (body: {
  data: Array<ClientAddressType>
}): Promise<CreateClientResType> => {
  const { data } = await axios.patch(`/api/enough/u/client/address`, {
    data: body.data,
  })
  return data
}

export const updateContactPerson = async (
  contactPersonId: number,
  body: ContactPersonType,
): Promise<ContactPersonType> => {
  const { data } = await axios.patch(
    `/api/enough/u/contact-person/${contactPersonId}`,
    body,
  )
  return data
}

export const createContactPerson = async (
  body: Array<CreateContactPersonFormType>,
): Promise<ContactPersonType[]> => {
  const { data } = await axios.post(`/api/enough/u/contact-person`, {
    data: body,
  })
  return data
}

export const deleteContactPerson = async (
  contactPersonId: number,
): Promise<ContactPersonType> => {
  const { data } = await axios.delete(
    `/api/enough/u/contact-person/${contactPersonId}`,
  )
  return data
}

export const deleteNotesToClientFiles = async (fileId: number) => {
  await axios.delete(`/api/enough/u/client/payment-info/notes/file/${fileId}`)
}

export const createClientMemo = async (
  body: ClientMemoPostType,
): Promise<ContactPersonType> => {
  const { data } = await axios.post(`/api/enough/u/client/memo`, body)
  return data
}

export type updateClientMemoType = {
  memoId: number
  memo: string
}
export const updateClientMemo = async (
  body: updateClientMemoType,
): Promise<ClientMemoType> => {
  const { data } = await axios.patch(`/api/enough/u/client/memo`, body)
  return data
}

export const deleteClientMemo = async (
  memoId: number,
): Promise<ClientMemoType> => {
  const { data } = await axios.delete(`/api/enough/u/client/memo/${memoId}`)
  return data
}

export const deleteClient = async (
  clientId: number,
): Promise<ClientMemoType> => {
  const { data } = await axios.delete(`/api/enough/u/client/${clientId}`)
  return data
}

export const getClientProjectList = async (
  clientId: number,
  filter: ClientProjectFilterType,
): Promise<{ data: ClientProjectListType[]; count: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${clientId}/projects?${makeQuery(filter)}`,
    )

    // const list: ClientProjectListType[] = [
    //   {
    //     id: 0,
    //     corporationId: 'Q-000001',
    //     workName: 'The Glory',
    //     projectName: 'The Glory 1~2',
    //     category: 'Webcomics',
    //     serviceType: ['Translation', 'Proofreading'],
    //     dueDate: '2022-04-27T14:13:15Z',
    //     status: 'Active',
    //     orderDate: '2022-04-20T14:13:15Z',
    //     projectDescription: 'Test',
    //     type: 'quote',
    //   },
    //   {
    //     id: 1,
    //     corporationId: 'O-000001',
    //     workName: 'Dark Night',
    //     projectName: 'Dark Night 1~2',
    //     category: 'Webcomics',
    //     serviceType: ['Translation', 'Proofreading'],
    //     dueDate: '2022-04-28T14:13:15Z',
    //     status: 'Active',
    //     orderDate: '2022-04-20T14:13:15Z',
    //     projectDescription: 'Test2',
    //     type: 'order',
    //   },
    // ]
    return data
    // return {
    //   data: list,
    //   totalCount: list.length,
    // }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type ClientProjectCalendarData = {
  data: Array<ClientProjectCalendarEventType>
  count: number
}

export type ClientProjectCalendarEventType = ClientProjectListType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getClientProjectsCalendarData = async (
  id: number,
  year: number,
  month: number,
  selectedType: 'quote' | 'order',
): Promise<ClientProjectCalendarData> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${id}/projects?year=${year}&month=${month}&projectType=${selectedType}`,
    )

    return {
      data: data.data?.map((item: ClientProjectListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar:
              item.type === 'order'
                ? getOrderStatusColor(item.status as OrderStatus & OrderLabel)
                : getQuoteStatusColor(item.status as QuotesStatus),
          },
          allDay: true,
        }
      }),
      count: data?.length ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type ClientInvoiceCalendarData = {
  data: Array<ClientInvoiceCalendarEventType>
  totalCount: number
  count: number
}

export type ClientInvoiceCalendarEventType = ClientInvoiceListType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getClientInvoiceList = async (
  id: number,
  filter: ClientInvoiceFilterType,
): Promise<{ data: ClientInvoiceListType[]; totalCount: number }> => {
  const { data } = await axios.get(
    `/api/enough/u/client/${id}/invoices?${makeQuery(filter)}`,
  )

  return data
}

export const getClientInvoicesCalendarData = async (
  id: number,
  year: number,
  month: number,
): Promise<ClientInvoiceCalendarData> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${id}/invoices?year=${year}&month=${month}`,
    )

    return {
      data: data.data.map((item: ClientInvoiceListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: getReceivableStatusColor(item.invoiceStatus),
          },
          allDay: true,
        }
      }),
      totalCount: data?.totalCount ?? 0,
      count: data?.count ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
      count: 0,
    }
  }
}

export const getWorkNameList = async (
  id: number,
): Promise<Array<{ value: string; label: string }>> => {
  try {
    const { data } = await axios.get(`/api/enough/u/client/work/list`)
    return data
  } catch (e: any) {
    return [{ value: '', label: '' }]
  }
}

// TODO: work name 생성 body, request 타입 알아야 함
export const createWorkList = async (
  body: CreateWorkNameType,
): Promise<WorkNameResType> => {
  const { data } = await axios.post(`/api/enough/u/client/`, body)
  return data
}
