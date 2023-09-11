import { ItemResType } from '@src/types/common/orders-and-quotes.type'

import {
  CreateInvoiceReceivableRes,
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
    taxInvoiceIssued: data.taxInvoiceIssued ? '1' : '0',
    showDescription: data.showDescription ? '1' : '0',
    setReminder: data.setReminder ? '1' : '0',
  })
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
        taxInvoiceIssued: form.taxInvoiceIssued ? '1' : '0',
        showDescription: form.showDescription ? '1' : '0',
        setReminder: form.setReminder ? '1' : '0',
      },
    )

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
): Promise<boolean> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/receivable/${invoiceId}/confirm`,
    )
    return data
  } catch (e: any) {
    return false
  }
}

export const deliverTaxInvoice = async (
  invoiceId: number,
  fileInfo: DeliveryFileType[],
): Promise<boolean> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/receivable/${invoiceId}/tax-invoice/send`,
      { files: fileInfo },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const markInvoiceAsPaid = async (
  invoiceId: number,
  info: MarkDayInfo,
): Promise<boolean> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/receivable/${invoiceId}/set-paid`,
      info,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const cancelInvoice = async (
  invoiceId: number,
  info: CancelReasonType,
): Promise<boolean> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/receivable/${invoiceId}/cancel`,
      { reason: info },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const restoreVersion = async (historyId: number): Promise<boolean> => {
  try {
    const { data } = await axios.put(
      `/api/enough/u/invoice/receivable/restore/${historyId}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
