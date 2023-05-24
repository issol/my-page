import axios from 'src/configs/axios'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { UserDataType } from '@src/context/types'
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
} from '@src/types/common/quotes.type'
import { PostItemType } from '@src/types/common/item.type'
import { QuotesFilterType } from '@src/types/quotes/quote'
import {
  ClientType,
  LanguageAndItemType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'

export type MemberListType = Pick<
  UserDataType,
  'userId' | 'firstName' | 'middleName' | 'lastName' | 'email' | 'jobTitle'
>
export const getMemberList = async (): Promise<Array<MemberListType>> => {
  try {
    const { data } = await axios.get(`/api/enough/a/role/us`)
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
    : status === 'Review before submission'
    ? `#20B6E5`
    : status === 'Pending'
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
    : null
}

export const getQuotesCalendarData = async (
  date: string,
  filter: QuotesFilterType,
): Promise<{ data: Array<QuotesListType>; totalCount: number }> => {
  try {
    // const { data } = await axios.get(`/api/enough/u/quote?calendarDate=${date}?${makeQuery(filter)}`)
    const data = {
      data: [
        {
          id: 'strin1212g',
          corporationId: 'strin12323g',
          status: 'New' as QuoteStatusType,
          projectName: 'project',
          client: {
            name: 'client name',
            email: 'dflskdf.cvomfs.d',
          },
          contactPerson: {
            firstName: 'string',
            middleName: 'string',
            lastName: 'string',
            email: 'strinbong@dsfl.com',
          },
          category: 'Copywriting',
          serviceType: ['DTP'],
          quoteDate: '2023-05-18T18:58:01.727Z',
          quoteDeadline: '2023-05-22T18:58:01.727Z',
          quoteExpiry: '2023-05-22T18:58:01.727Z',
          totalPrice: 123,
        },
      ],
      totalCount: 0,
    }
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
  QuotesProjectInfoFormType

// ** step 1-3
export const createQuotesInfo = async (
  form: CreateQuotesFormType,
): Promise<any> => {
  try {
    const { data } = await axios.post(`/api/enough/u/quote`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** step 4-1
export const createLangPairForQuotes = async (
  quoteId: number,
  form: Array<LanguagePairsType>,
): Promise<any> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/quote/language/pair?quoteId=${quoteId}`,
      { data: form },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** step 4-2
export const createItemsForQuotes = async (
  orderId: number,
  form: Array<PostItemType>,
): Promise<any> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/order/item?orderId=${orderId}`,
      { items: form },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getQuotesDetail = async (id: number): Promise<any> => {
  try {
    const data = axios.get(`/api/enough/u/quote/${id}`)
    return data
    return
  } catch (e: any) {
    // throw new Error(e)
    return null
  }
}

/* TODO : endpoint 수정하기 */
export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/team`)
    return data.members
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TODO : endpoint 수정하기 */
export const getClient = async (id: number): Promise<ClientType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/client`)

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TODO : endpoint 수정하기 */
export const getLangItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/items`)
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

/* TODO : endpoint 수정하기 */
export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
