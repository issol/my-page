import axios from '@src/configs/axios'

import { makeQuery } from '@src/shared/transformer/query.transformer'
import { RequestStatusType } from '@src/types/requests/common.type'
import { RequestFilterType } from '@src/types/requests/filters.type'
import { RequestListType } from '@src/types/requests/list.type'

export const getClientRequestList = async (
  filter: RequestFilterType,
): Promise<{ data: RequestListType[]; count: number; totalCount: number }> => {
  try {
    // const { data } = await axios.get(`/api/enough/u/job?${makeQuery(filter)}`)
    // return data
    return {
      count: 1,
      totalCount: 0,
      data: [],
    }
  } catch (error) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

function getColor(status: RequestStatusType) {
  return status === 'Request created'
    ? '#A81988'
    : status === 'In preparation'
    ? '#FDB528'
    : status === 'Changed into quote'
    ? '#64C623'
    : status === 'Changed into order'
    ? '#1A6BBA'
    : status === 'Canceled'
    ? '#FF4D49'
    : ''
}

export const getClientRequestCalendarData = async (
  year: number,
  month: number,
  filter: RequestFilterType,
): Promise<{ data: RequestListType[]; count: number; totalCount: number }> => {
  try {
    /* TODO: endpoint변경하기 */
    // const { data } = await axios.get(
    //   `/api/enough/u/quote?year=${year}&month=${month}&${makeQuery(filter)}`,
    // )
    const data = { data: [], count: 1, totalCount: 0 }
    return {
      data: data.data?.map((item: RequestListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: getColor(item.status),
          },
          allDay: true,
        }
      }),
      count: data?.count ?? 0,
      totalCount: data?.totalCount ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}
