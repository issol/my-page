import axios from '@src/configs/axios'

import { makeQuery } from '@src/shared/transformer/query.transformer'
import { RequestFilterType } from '@src/types/requests/filters'
import { RequestListType } from '@src/types/requests/list'

export const getClientRequestList = async (
  filter: RequestFilterType,
): Promise<{ data: RequestListType[]; count: number }> => {
  try {
    // const { data } = await axios.get(`/api/enough/u/job?${makeQuery(filter)}`)
    // return data
    return {
      count: 1,
      data: [],
    }
  } catch (error) {
    return {
      data: [],
      count: 0,
    }
  }
}
