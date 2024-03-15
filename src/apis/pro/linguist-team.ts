import axios from '@src/configs/axios'
import { FilterType } from '@src/pages/pro/linguist-team'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  LinguistTeamDetailType,
  LinguistTeamFormType,
  LinguistTeamListType,
} from '@src/types/pro/linguist-team'

export const getLinguistTeamList = async (
  filter: FilterType,
): Promise<{
  data: LinguistTeamListType[]
  totalCount: number
  count: number
}> => {
  const { data } = await axios.get(
    `/api/enough/u/pro/linguist-team/list?${makeQuery(filter)}`,
  )

  return data
}

export const getLinguistTeamDetail = async (
  id: number,
): Promise<LinguistTeamDetailType> => {
  const { data } = await axios.get(`/api/enough/u/pro/linguist-team/${id}`)

  // return detailData
  return data
}

export const createLinguistTeam = async (
  payload: Omit<LinguistTeamFormType, 'pros'> & {
    pros: Array<{ userId: number; order: number }>
  },
) => {
  const { data } = await axios.post(`/api/enough/u/pro/linguist-team`, {
    ...payload,
  })

  return data
}

export const updateLinguistTeam = async (
  payload: Omit<LinguistTeamFormType, 'pros'> & {
    pros: Array<{ userId: number; order: number }>
  },
) => {
  const { data } = await axios.patch(`/api/enough/u/pro/linguist-team`, {
    ...payload,
  })

  return data
}

export const deleteLinguistTeam = async (id: number) => {
  const { data } = await axios.delete(`/api/enough/u/pro/linguist-team/${id}`)

  return data
}
