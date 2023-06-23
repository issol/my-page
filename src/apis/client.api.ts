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
  ClientInvoiceFilterType,
  ClientInvoiceListType,
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
  totalCount: number
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
      totalCount: 0,
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

export const updateClientAddress = async (body: {
  data: Array<ClientAddressType>
}): Promise<CreateClientResType> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/client/address`, {
      data: body.data,
    })
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
): Promise<ContactPersonType[]> => {
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
  body: ClientMemoPostType,
): Promise<ContactPersonType> => {
  try {
    const { data } = await axios.post(`/api/enough/u/client/memo`, body)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export type updateClientMemoType = {
  memoId: number
  memo: string
}
export const updateClientMemo = async (
  body: updateClientMemoType,
): Promise<ClientMemoType> => {
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

export const deleteClient = async (
  clientId: number,
): Promise<ClientMemoType> => {
  try {
    const { data } = await axios.delete(`/api/enough/u/client/${clientId}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
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
    throw new Error(e)
  }
}

export type ClientProjectCalendarData = {
  data: Array<ClientProjectCalendarEventType>
  totalCount: number
}

export type ClientProjectCalendarEventType = ClientProjectListType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getClientProjectsCalendarData = async (
  id: number,
  date: string,
): Promise<ClientProjectCalendarData> => {
  const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']
  const color_overdue = 'overdue'

  try {
    const { data } = await axios.get(
      `/api/enough/u/pro/${id}/project?date=${date}`,
    )

    const list: ClientProjectListType[] = [
      {
        id: 4,
        corporationId: 'O-000004',
        workName: 'The Glory',
        projectName: 'The Glory 1~2',
        category: 'Webcomics',
        serviceType: ['Translation', 'Proofreading'],
        dueDate: '2023-04-27T14:13:15Z',
        status: 'Active',
        orderDate: '2023-04-20T14:13:15Z',
        projectDescription: 'Test',
        type: 'order',
      },
      {
        id: 1,
        corporationId: 'O-000001',
        workName: 'Hoffman Website',
        projectName: 'Website 4',
        category: 'Webnovels',
        serviceType: ['Translation', 'Proofreading'],
        dueDate: '2023-04-27T14:13:15Z',
        status: 'Active',
        orderDate: '2023-04-20T14:13:15Z',
        projectDescription: 'Test',
        type: 'order',
      },
      {
        id: 2,
        corporationId: 'Q-000002',
        workName: 'Black Mirror',
        projectName: 'Black Mirror 3~4',
        category: 'Documents/Text',
        serviceType: ['Translation', 'Proofreading'],
        dueDate: '2023-04-27T14:13:15Z',
        status: 'Active',
        orderDate: '2023-04-20T14:13:15Z',
        projectDescription: 'Test',
        type: 'quote',
      },
      {
        id: 3,
        corporationId: 'O-000003',
        workName: 'DP',
        projectName: 'DP 1.5',
        category: 'OTT/Subtitle',
        serviceType: ['Translation', 'Proofreading'],
        dueDate: '2023-04-27T14:13:15Z',
        status: 'Active',
        orderDate: '2023-04-20T14:13:15Z',
        projectDescription: 'Test',
        type: 'order',
      },
    ]
    return {
      data: list.map((item: ClientProjectListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar:
              item.status === 'Overdue'
                ? color_overdue
                : colors[idx % colors.length],
          },
          allDay: true,
        }
      }),
      totalCount: data?.totalCount ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

export type ClientInvoiceCalendarData = {
  data: Array<ClientInvoiceCalendarEventType>
  totalCount: number
}

export type ClientInvoiceCalendarEventType = ClientInvoiceListType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getClientInvoiceList = async (
  id: number,
  filter: ClientInvoiceFilterType,
): Promise<{ data: ClientInvoiceListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${id}/invoices?${makeQuery(filter)}`,
    )

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getClientInvoicesCalendarData = async (
  id: number,
  year: string,
  month: string,
  filter: ClientInvoiceFilterType,
): Promise<ClientInvoiceCalendarData> => {
  const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']
  const color_overdue = 'overdue'

  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${id}/invoices?year=${year}&month=${
        month + 1
      }&${makeQuery(filter)}`,
    )

    return {
      data: data.map((item: ClientInvoiceListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar:
              item.invoiceStatus === 'Overdue'
                ? color_overdue
                : colors[idx % colors.length],
          },
          allDay: true,
        }
      }),
      totalCount: data?.totalCount ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
