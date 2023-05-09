import axios from '@src/configs/axios'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import {
  ClientType,
  LanguageAndItemType,
  ProjectInfoType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

  return data
}

export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/team`)

  return data.members
}

export const getClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/client`)

  return data
}

export const getLangItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  try {
    // const { data } = await axios.get(`/api/enough/u/order/${id}/items`)
    // return data;
    return {
      id: 1,
      languagePairs: [{ id: 1, source: 'en', target: 'ko', priceId: null }],
      items: [
        {
          id: 1,
          name: 'Kim bon',
          dueAt: Date(),
          contactPersonId: 5,
          source: 'en',
          target: 'ko',
          priceId: null,
          detail: [
            {
              priceUnitId: 1,
              quantity: 2,
              priceUnit: 'title',
              unitPrice: 2000,
              prices: 30000,
              unit: 'Graphic',
              currency: 'USD',
              priceFactor: '1.5',
            },
          ],
          description: null,
          analysis: [],
          totalPrice: 20000,
        },
      ],
    }
  } catch (e: any) {
    throw new Error(e)
  }
}
