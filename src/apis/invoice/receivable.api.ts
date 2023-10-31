import { ItemResType } from '@src/types/common/orders-and-quotes.type'

import {
  CreateInvoiceReceivableRes,
  InvoiceLanguageItemType,
  InvoiceReceivableDetailType,
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
  InvoiceReceivablePatchParamsType,
  InvoiceVersionHistoryResType,
  InvoiceVersionHistoryType,
  MarkDayInfo,
} from '@src/types/invoice/receivable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import {
  ClientType,
  DeliveryFileType,
  LanguageAndItemType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { getReceivableStatusColor } from '@src/shared/helpers/colors.helper'
import { CancelReasonType } from '@src/types/requests/detail.type'

export const getReceivableList = async (
  filter: InvoiceReceivableFilterType,
): Promise<{
  data: InvoiceReceivableListType[]
  totalCount: number
  count: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/list?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
      count: 0,
    }
  }
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
            calendar: getReceivableStatusColor(item.invoiceStatus),
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
  return await axios.post('/api/enough/u/invoice/receivable', {
    ...data,

    showDescription: data.showDescription ? '1' : '0',
    setReminder: data.setReminder ? '1' : '0',
  })
}

export const getInvoiceDetail = async (
  id: number,
): Promise<InvoiceReceivableDetailType> => {
  const { data } = await axios.get(`/api/enough/u/invoice/receivable/${id}`)
  return data
}

export const getInvoiceLanguageItems = async (
  id: number,
): Promise<InvoiceLanguageItemType> => {
  const { data } = await axios.get(
    `/api/enough/u/invoice/receivable/${id}/items`,
  )

  console.log(data)
  return data
  // return {
  //   ...data,
  //   items: data.items.map((item: ItemResType) => ({
  //     ...item,
  //     name: item?.itemName,
  //     source: item?.sourceLanguage,
  //     target: item?.targetLanguage,
  //     totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
  //   })),
  // }
}

export const getInvoiceClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(
    `/api/enough/u/invoice/receivable/${id}/client`,
  )
  return data
}

export const getInvoiceProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  const { data } = await axios.get(
    `/api/enough/u/invoice/receivable/${id}/team`,
  )
  return data.members
}

export const getInvoiceVersionHistory = async (
  id: number,
): Promise<InvoiceVersionHistoryType[]> => {
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
}

export const patchInvoiceInfo = async (
  id: number,
  form: InvoiceReceivablePatchParamsType,
  type: 'basic' | 'accounting',
): Promise<{ id: number }> => {
  const { data } =
    type === 'basic'
      ? await axios.patch(`/api/enough/u/invoice/receivable/${id}`, {
          ...form,
        })
      : await axios.patch(
          `/api/enough/u/invoice/receivable/${id}/accounting-info`,
          { ...form },
        )

  return data
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
    taxInvoiceDueAt?: string | null
    taxInvoiceDueTimezone?: CountryType | null
  },
) => {
  await axios.patch(`/api/enough/u/invoice/receivable/${id}/accept`, {
    ...form,
  })
}
export const confirmInvoiceByLpm = async (
  invoiceId: number,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/receivable/${invoiceId}/confirm`,
    )
    return data
  } catch (e: any) {
    return {
      id: invoiceId,
    }
  }
}

export const deliverTaxInvoice = async (
  invoiceId: number,
  fileInfo: DeliveryFileType[],
): Promise<boolean> => {
  const { data } = await axios.patch(
    `/api/enough/u/invoice/receivable/${invoiceId}/tax-invoice/send`,
    { files: fileInfo },
  )
  return data
}

export const markInvoiceAsPaid = async (
  invoiceId: number,
  info: MarkDayInfo,
): Promise<boolean> => {
  const { data } = await axios.patch(
    `/api/enough/u/invoice/receivable/${invoiceId}/set-paid`,
    info,
  )
  return data
}

export const cancelInvoice = async (
  invoiceId: number,
  info: CancelReasonType,
): Promise<boolean> => {
  const { data } = await axios.patch(
    `/api/enough/u/invoice/receivable/${invoiceId}/cancel`,
    { reason: info },
  )
  return data
}

export const restoreVersion = async (historyId: number): Promise<boolean> => {
  const { data } = await axios.put(
    `/api/enough/u/invoice/receivable/restore/${historyId}`,
  )
  return data
}
