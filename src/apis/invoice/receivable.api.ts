import { ItemResType } from '@src/types/common/orders-and-quotes.type'
import { CurrencyType } from '@src/types/common/standard-price'
import {
  InvoiceProjectInfoFormType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'
import {
  CreateInvoiceReceivableRes,
  InvoiceReceivableDetailType,
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
  InvoiceReceivablePatchParamsType,
  InvoiceVersionHistoryResType,
  InvoiceVersionHistoryType,
} from '@src/types/invoice/receivable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import {
  ClientType,
  LanguageAndItemType,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { CountryType } from '@src/types/sign/personalInfoTypes'

export const getReceivableList = async (
  filter: InvoiceReceivableFilterType,
): Promise<{ data: InvoiceReceivableListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/list?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

function getColor(status: InvoiceReceivableStatusType) {
  return status === 'In preparation'
    ? '#F572D8'
    : status === 'Checking in progress'
    ? '#FDB528'
    : status === 'Accepted by client'
    ? '#64C623'
    : status === 'Tax invoice issued'
    ? '#46A4C2'
    : status === 'Paid'
    ? '#267838'
    : status === 'Overdue'
    ? '#FF4D49'
    : status === 'Canceled'
    ? '#FF4D49'
    : status === 'Overdue (Reminder sent)'
    ? '#FF4D49'
    : status === 'New'
    ? '#666CFF'
    : status === 'Invoice confirmed'
    ? '#64C623'
    : status === 'Revised'
    ? '#AD7028'
    : status === 'Under review'
    ? '#FDB528'
    : status === 'Under revision'
    ? '#BA971A'
    : ''
}

export const getInvoiceReceivableCalendarData = async (
  year: number,
  month: number,
  filter: InvoiceReceivableFilterType,
): Promise<{
  data: Array<InvoiceReceivableListType>
  totalCount: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/calendar?year=${year}&month=${month}&${makeQuery(
        filter,
      )}`,
    )

    return {
      data: data.data?.map((item: InvoiceReceivableListType) => {
        return {
          ...item,
          status: item.invoiceStatus,
          extendedProps: {
            calendar: getColor(item.invoiceStatus),
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

export const createInvoice = async (
  data: InvoiceReceivablePatchParamsType,
): Promise<CreateInvoiceReceivableRes> => {
  return await axios.post('/api/enough/u/invoice/receivable', data)
}

export const getInvoiceDetail = async (
  id: number,
): Promise<InvoiceReceivableDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/receivable/${id}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceLanguageItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/${id}/items`,
    )

    return {
      ...data,
      items: data.items.map((item: ItemResType) => ({
        ...item,
        name: item?.itemName,
        source: item?.sourceLanguage,
        target: item?.targetLanguage,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
      })),
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceClient = async (id: number): Promise<ClientType> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/${id}/client`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/${id}/team`,
    )
    return data.members
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceVersionHistory = async (
  id: number,
): Promise<InvoiceVersionHistoryType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/${id}/history`,
    )

    return data.map((value: InvoiceVersionHistoryResType) => ({
      ...value,
      items: {
        ...value.items,
        items: value.items.items.map((item: ItemResType) => ({
          ...item,
          name: item?.itemName,
          source: item?.sourceLanguage,
          target: item?.targetLanguage,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
        })),
      },
      members: value.projectTeam.members,
    }))
  } catch (e: any) {
    throw new Error(e)
  }
}

export const patchInvoiceInfo = async (
  id: number,
  form: InvoiceReceivablePatchParamsType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/receivable/${id}`,
      {
        ...form,
      },
    )
    // console.log(data)

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteInvoice = async (id: number) => {
  await axios.delete(`/api/enough/u/invoice/receivable/${id}`)
}

export const checkEditable = async (id: number): Promise<boolean> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/${id}/editable`,
    )
    return data
  } catch (e: any) {
    return false
  }
}

export const confirmInvoiceFromClient = async (
  id: number,
  form: {
    clientConfirmedAt: string
    clientConfirmTimezone: CountryType
    taxInvoiceDueAt?: string
    taxInvoiceDueTimezone?: CountryType
  },
) => {
  await axios.patch(`/api/enough/u/invoice/receivable/${id}/accept`, {
    ...form,
  })
}
