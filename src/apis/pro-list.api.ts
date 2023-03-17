import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { ProListFilterType } from '@src/types/pro/list'

export const getProList = async (filters: ProListFilterType) => {
  const data = await axios.get(`/api/enough/pro/user/al?${makeQuery(filters)}`)

  return data.data
}
