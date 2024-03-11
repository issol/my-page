import axios from '@src/configs/axios'
import { FilterType } from '@src/pages/pro/linguist-team'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  LinguistTeamDetailType,
  LinguistTeamFormType,
  LinguistTeamListType,
} from '@src/types/pro/linguist-team'

const testData: LinguistTeamListType[] = Array.from({ length: 12 }, (_, i) => {
  const prosLength = Math.floor(Math.random() * 5) + 1
  const pros = Array.from({ length: prosLength }, (_, j) => ({
    userId: j + 1,
    firstName: `FirstName${j + 1}`,
    lastName: `LastName${j + 1}`,
  }))

  return {
    id: i + 1,
    corporationId: `LT-00000${i + 1}`,
    name: `Team${i + 1}`,
    sourceLanguage: `en`,
    targetLanguage: `ko`,
    serviceTypeId: i + 1,
    client: `Client${i + 1}`,
    description: `Description${i + 1}`,
    isPrivate: Math.random() < 0.5,
    pros,
  }
})

const detailData: LinguistTeamDetailType = {
  id: 1,
  corporationId: 'LT-000001',
  name: 'Team1',
  author: {
    userId: 1,
    firstName: 'FirstName1',
    lastName: 'LastName1',
    email: 'leriel@glozinc.com',
  },
  updatedAt: '2024-03-07',
  sourceLanguage: 'en',
  targetLanguage: 'ko',
  serviceTypeId: 1,
  client: 'Client1',
  description: 'Description1',
  isPrivate: true,
  isPrioritized: true,
  pros: [
    {
      email: 'gloleriel@glozin.com',
      firstName: 'Leriel',
      lastName: 'Gonzales',
      userId: 1,
      client: 'HYBE',
      experience: '10 years',
      jobType: 'Document/Text',
      middleName: 'L',
      order: 1,
      role: 'Translator',
      status: 'Onboard',
    },
    {
      email: 'gloleriel@glozin.com',
      firstName: 'Leriel',
      lastName: 'Gonzales',
      userId: 2,
      client: 'HYBE',
      experience: '10 years',
      jobType: 'Document/Text',
      middleName: 'L',
      order: 2,
      role: 'Translator',
      status: 'Onboard',
    },

    {
      email: 'gloleriel@glozin.com',
      firstName: 'Leriel',
      lastName: 'Gonzales232',
      userId: 1,
      client: 'HYBE',
      experience: '10 years',
      jobType: 'Document/Text',
      middleName: 'L',
      order: 3,
      role: 'Translator',
      status: 'Onboard',
    },
  ],
}

export const getLinguistTeamList = async (filter: FilterType) => {
  const { data } = await axios.get(
    `/api/enough/u/pro/linguist-team/list?${makeQuery(filter)}`,
  )

  return data
}

export const getLinguistTeamDetail = async (id: number) => {
  // const { data } = await axios.get(`/api/pro/linguist-team/${id}`)

  return detailData
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
