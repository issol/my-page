import axios from 'src/configs/axios'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { UserDataType } from '@src/context/types'
import { v4 as uuidv4 } from 'uuid'
import {
  ClientFormType,
  ItemResType,
  LanguagePairsType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import {
  ProjectInfoType,
  QuoteStatusType,
  QuotesListType,
  QuotesProjectInfoFormType,
  VersionHistoryType,
} from '@src/types/common/quotes.type'
import { PostItemType } from '@src/types/common/item.type'
import { QuotesFilterType, ReasonType } from '@src/types/quotes/quote'
import {
  ClientType,
  LanguageAndItemType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { CancelReasonType } from '@src/types/requests/detail.type'
import { updateProjectInfoType } from '@src/pages/quotes/detail/[id]'

export type MemberListType = Pick<
  UserDataType,
  'userId' | 'firstName' | 'middleName' | 'lastName' | 'email' | 'jobTitle'
>
export const getMemberList = async (): Promise<Array<MemberListType>> => {
  try {
    // const { data } = await axios.get(`/api/enough/a/role/us`)
    const { data } = await axios.get(`/api/enough/a/role/members`)
    return data
  } catch (e: any) {
    return []
  }
}
export const getQuotesList = async (
  filter: QuotesFilterType,
): Promise<{ data: Array<QuotesListType>; totalCount: number }> => {
  try {
    const { data } = await axios.get(`/api/enough/u/quote?${makeQuery(filter)}`)
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

function getColor(status: QuoteStatusType) {
  return status === 'New'
    ? '#666CFF'
    : status === 'In preparation'
    ? `#F572D8`
    : status === 'Internal review'
    ? `#D8AF1D`
    : status === 'Client review'
    ? `#FDB528`
    : status === 'Expired'
    ? '#FF4D49'
    : status === 'Rejected'
    ? '#FF4D49'
    : status === 'Accepted'
    ? '#64C623'
    : status === 'Changed into order'
    ? '#1A6BBA'
    : status === 'Canceled'
    ? '#FF4D49'
    : status === 'Under review'
    ? '#FDB528'
    : status === 'Revised'
    ? '#AD7028'
    : status === 'Revision requested'
    ? '#A81988'
    : status === 'Under revision'
    ? '#26C6F9'
    : status === 'Quote sent'
    ? '#2B6603'
    : ''
}

export const getQuotesCalendarData = async (
  year: number,
  month: number,
  filter: QuotesFilterType,
): Promise<{ data: Array<QuotesListType>; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/quote?year=${year}&month=${month}&${makeQuery(filter)}`,
    )

    return {
      data: data.data?.map((item: QuotesListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: getColor(item.status),
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

export type CreateQuotesFormType = ProjectTeamFormType &
  ClientFormType &
  QuotesProjectInfoFormType & { requestId?: number }

// ** step 1-3
export const createQuotesInfo = async (
  form: CreateQuotesFormType,
): Promise<any> => {
  const { data } = await axios.post(`/api/enough/u/quote`, form)
  return data
}

// ** step 4-1
export const createLangPairForQuotes = async (
  quoteId: number,
  form: Array<LanguagePairsType>,
): Promise<any> => {
  const { data } = await axios.post(
    `/api/enough/u/quote/language/pair?quoteId=${quoteId}`,
    { data: form },
  )
  return data
}

// ** step 4-2
export const createItemsForQuotes = async (
  orderId: number,
  form: Array<PostItemType>,
): Promise<any> => {
  const { data } = await axios.post(
    `/api/enough/u/quote/item?quoteId=${orderId}`,
    { items: form },
  )
  return data
}

export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/quote/${id}/team`)
    return data.members.map((value: any) => ({ ...value, id: uuidv4() }))
  } catch (e: any) {
    // throw new Error(e)
    return []
  }
}

export const getClient = async (id: number): Promise<ClientType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/quote/${id}/client`)

    return data
  } catch (e: any) {
    return {
      addressType: '',
      client: {
        clientId: NOT_APPLICABLE,
        email: '',
        fax: null,
        mobile: null,
        phone: null,
        timezone: { code: '', label: '', phone: '' },
        name: '',
        isTaxable: false,
        taxable: false,
        tax: null,
      },
      contactPerson: null,
      clientAddress: [],
      isEnrolledClient: false,
    }
  }
}

export const getLangItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  const { data } = await axios.get(`/api/enough/u/quote/${id}/items`)
  return {
    ...data,
    items: data.items.map((item: ItemResType) => ({
      ...item,
      name: item?.itemName,
      itemName: item?.itemName,
      source: item?.sourceLanguage,
      target: item?.targetLanguage,
      totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
      initialPrice: item.initialPrice,
    })),
  }
}

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  const { data } = await axios.get(`/api/enough/u/quote/${id}/project`)

  return data
}

export const deleteQuotes = async (id: number): Promise<void> => {
  await axios.delete(`/api/enough/u/quote/${id}`)
}

export const getVersionHistory = async (
  id: number,
): Promise<VersionHistoryType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/quote/${id}/history`)
    return data
  } catch (e: any) {
    return []
  }
}

export const restoreVersion = async (id: number): Promise<void> => {
  await axios.post(`/api/enough/u/quote/history/${id}`)
}

export const patchQuoteProjectInfo = async (
  id: number,
  form: updateProjectInfoType,
) => {
  const { data } = await axios.patch(`/api/enough/u/quote/${id}`, { ...form })
  return data
}

export const patchQuoteLanguagePairs = async (
  id: number,
  form: Array<LanguagePairsType>,
) => {
  const { data } = await axios.patch(
    `/api/enough/u/quote/language/pair?quoteId=${id}`,
    { data: form },
  )
  return data
}

export const patchQuoteItems = async (
  id: number,
  form: Array<PostItemType>,
) => {
  const { data } = await axios.patch(`/api/enough/u/quote/item?quoteId=${id}`, {
    items: form,
  })
  return data
}

export const confirmQuote = async (id: number) => {
  const { data } = await axios.patch(`/api/enough/u/quote/${id}/confirm`)
  return data
}

export const patchQuoteStatus = async (
  id: number,
  status: number,
  reason?: ReasonType,
) => {
  const { data } = await axios.patch(`/api/enough/u/quote/${id}/set-status`, {
    status: status,
    reason: reason,
  })

  return data
}