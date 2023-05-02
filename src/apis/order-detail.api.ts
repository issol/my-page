import axios from '@src/configs/axios'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import {
  ClientType,
  ProjectInfoType,
  ProjectTeamType,
} from '@src/types/orders/order-detail'

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

  return data
}

export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamType[]> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/team`)

  return data.members
}

export const getClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/client`)

  return data
}

export const getLangItems = async (id: number): Promise<Row[]> => {
  const res = [
    {
      id: 1,
      name: 'College Student diary_EN_KO',

      source: 'en',
      target: 'ko',

      detail: [
        {
          id: 0,
          quantity: 1,
          priceUnit: 'X3 Words Translation',
          unit: 'Words',
          price: 10,
          totalPrice: 10,
        },
        {
          id: 1,
          quantity: 120,
          priceUnit: 'Words Translation 100% Match',
          unit: 'Words',
          price: 10,
          totalPrice: 1200,
        },
      ],
    },

    {
      id: 2,
      name: 'College Student 1234',

      source: 'en',
      target: 'ko',

      detail: [
        {
          id: 0,
          quantity: 1,
          priceUnit: 'X3 Words Translation111',
          unit: 'Words',
          price: 10,
          totalPrice: 10,
        },
        {
          id: 1,
          quantity: 120,
          priceUnit: 'Words Translation 100% Match111111111',
          unit: 'Words',
          price: 10,
          totalPrice: 1200,
        },
        {
          id: 2,
          quantity: 120,
          priceUnit: 'Words Translation 100% Match111111111',
          unit: 'Words',
          price: 10,
          totalPrice: 1200,
        },
      ],
    },
  ]
  return res
}
