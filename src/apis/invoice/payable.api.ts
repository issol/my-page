import { InvoicePayableStatusType } from '@src/types/invoice/common.type'
import {
  InvoicePayableDetailType,
  InvoicePayableFilterType,
  InvoicePayableJobType,
  InvoicePayableListType,
  PayableFormType,
  PayableHistoryType,
} from '@src/types/invoice/payable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getPayableList = async (
  filter: InvoicePayableFilterType,
): Promise<{ data: InvoicePayableListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/list?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

function getColor(status: InvoicePayableStatusType) {
  return status === 'Invoice created'
    ? '#F572D8'
    : status === 'Invoice accepted'
    ? '#9B6CD8'
    : status === 'Paid'
    ? '#FF4D49'
    : status === 'Overdue'
    ? '#FF4D49'
    : status === 'Canceled'
    ? '#FF4D49'
    : ''
}

export const getInvoicePayableCalendarData = async (
  year: number,
  month: number,
  filter: InvoicePayableFilterType,
): Promise<{ data: Array<InvoicePayableListType>; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/calendar?year=${year}&month=${month}&${makeQuery(
        filter,
      )}`,
    )

    return {
      data: data.data?.map((item: InvoicePayableListType) => {
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

export const getInvoicePayableDetail = async (
  id: number,
): Promise<InvoicePayableDetailType> => {
  const { data } = await axios.get(`/api/enough/u/invoice/payable/${id}`)
  return data
}

export const getInvoicePayableJobList = async (
  payableId: number,
): Promise<{
  count: number
  totalCount: number
  data: InvoicePayableJobType[]
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/payable?${makeQuery({ payableId })}`,
    )
    return data
    // return {
    //   totalCount: 1,
    //   count: 1,
    //   data: [
    //     {
    //       id: 1,
    //       corporationId: 'KR-100',
    //       serviceType: 'Editing',
    //       name: 'bon',
    //       totalPrice: 100000,
    //       contactPerson: 'Bon',
    //       deletedAt: null,
    //       priceUnits: [
    //         {
    //           title: 'Price',
    //           unitPrice: 1000,
    //           quantity: 3,
    //           prices: 100000,
    //         },
    //       ],
    //     },
    //   ],
    // }
  } catch (e) {
    return {
      totalCount: 0,
      count: 0,
      data: [],
    }
  }
}
export const updateInvoicePayable = async (
  payableId: number,
  form: PayableFormType,
) => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/invoice/payable/${payableId}`,
      form,
    )
    return data
  } catch (e: any) {
    throw Error(e)
  }
}

export const deleteInvoicePayable = async (id: number) => {
  try {
    const { data } = await axios.delete(`/api/enough/u/invoice/payable/${id}`)
    return data
  } catch (e: any) {
    throw Error(e)
  }
}

export const deleteInvoicePayableJobs = async (
  payableId: number,
  jobIds: number[],
) => {
  try {
    const { data } = await axios.delete(
      `/api/enough/u/invoice/payable/${payableId}/remove-job`,
      { data: { jobIds } },
    )
    return data
  } catch (e: any) {
    throw Error(e)
  }
}

export const getPayableHistoryList = async (
  invoiceId: number,
  invoiceCorporationId: string,
): Promise<PayableHistoryType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/history/list?invoiceId=${invoiceId}&invoiceCorporationId=${invoiceCorporationId}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const checkPayableEditable = async (id: number): Promise<boolean> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/${id}/editable`,
    )
    return data
  } catch (e: any) {
    return false
  }
}
