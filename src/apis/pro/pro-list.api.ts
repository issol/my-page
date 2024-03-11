import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { LinguistTeamProListFilterType } from '@src/types/pro/linguist-team'
import { ProListFilterType } from '@src/types/pro/list'

export const getProList = async (
  filters: ProListFilterType | LinguistTeamProListFilterType,
) => {
  const data = await axios.get(`/api/enough/u/pro?${makeQuery(filters)}`)

  return data.data
}
