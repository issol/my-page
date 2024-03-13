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
  clientId: 40,
  description: 'Description1',
  isPrivate: true,
  isPrioritized: true,
  pros: [
    {
      id: 'P-122345',
      userId: 122345,
      resume: [
        'user/122345/resume/LeslieShea_Resume.pdf',
        'user/122345/resume/Copy of NDA_GLOCCONT_GDR_US (11).pdf',
        'user/122345/resume/Non-US Citizen W-8 (13) (1).pdf',
        'user/122345/resume/US Contractor Form W9.pdf',
      ],
      email: 'leslieyshea@gmail.com',
      firstName: 'Leslie',

      lastName: 'Shea',
      experience: '1-3 years',
      isOnboarded: true,
      onboardedAt: '2022-03-17T18:13:48.000Z',
      order: 1,
      status: 'Onboard',
      isActive: true,
      jobInfo: [
        {
          id: 113540,
          createdAt: '2023-10-30T16:58:28.993Z',
          updatedAt: '2023-10-30T16:58:28.993Z',
          jobId: '1',
          jobType: 'OTT/Subtitle',
          role: 'Subtitle author',
          source: 'en-US',
          target: 'en-US',
          roleRequestId: null,
          roleRequestStatus: null,
          testStatus: 'Awaiting assignment',
          selected: true,
        },
      ],
      clients: [
        {
          id: 1,
          client: '[TEST] NHN',
        },
      ],
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
  const { data } = await axios.get(`/api/pro/linguist-team/${id}`)

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