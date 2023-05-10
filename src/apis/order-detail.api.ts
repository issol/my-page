import axios from '@src/configs/axios'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import {
  ClientType,
  LanguageAndItemType,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

  return data
}

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

export const getClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/client`)

  return data
}

type ItemResType = {
  id: number
  contactPersonId: null | number
  itemName: string
  dueAt: string
  sourceLanguage: string
  targetLanguage: string
  priceId: number
  description: string | null
  totalPrice: string
}
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

export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`/api/enough/u/order/${id}`)
}

export const getVersionHistory = async (
  id: number,
): Promise<VersionHistoryType[]> => {
  const res: VersionHistoryType[] = [
    {
      id: 1,
      version: 1,
      email: 'leriel@glozinc.com',
      downloadedAt: '2023-03-21T08:20:46.678Z',
      history: {
        projectInfo: {
          id: 5,
          corporationId: 'O-000005',
          workName: 'The Glory',
          projectName: '1~4',
          projectDescription: 'Fantastic The Glory',
          category: 'S.F.',
          serviceType: ['Translation', 'DTP'],
          expertise: ['Gaming', 'Romance'],
          status: 'In preparation',

          revenueFrom: 'Korea',

          orderedAt: '2023-03-21T08:20:46.678Z',

          projectDueAt: '2023-03-21T08:20:46.678Z',
          projectDueTimezone: {
            code: 'string',
            label: 'string',
            phone: 'string',
          },
          tax: 10,
        },
        client: {
          addressType: 'billing',
          client: {
            clientId: 3,
            email: 'sdflk@sf.com',
            fax: null,
            mobile: '01038088637',
            phone: null,
            timezone: {
              code: 'AE',
              label: 'United Arab Emirates',
              phone: '971',
            },
            name: '쌔거',
          },
          contactPerson: {
            department: null,
            email: 'dsfsdf@com.com',
            fax: null,
            firstName: 'Gayeon',
            id: 5,
            isReferred: false,
            jobTitle: '매니죠',
            lastName: 'Kim',
            memo: 'sdfsdf',
            middleName: null,
            mobile: '01063611055',
            personType: 'Mr.',
            phone: null,
            timezone: { code: 'AF', label: 'Afghanistan', phone: '93' },
          },
          clientAddress: [
            {
              addressType: 'shipping',
              baseAddress: null,
              city: null,
              country: null,
              createdAt: '2023-04-17T21:05:51.771Z',
              detailAddress: null,

              name: null,
              state: null,
              updatedAt: '2023-04-17T21:05:51.771Z',
              zipCode: null,
              isSelected: false,
            },
            {
              addressType: 'billing',
              baseAddress: null,
              city: null,
              country: null,
              createdAt: '2023-04-17T21:05:51.771Z',
              detailAddress: null,

              name: null,
              state: null,
              updatedAt: '2023-04-17T21:05:51.771Z',
              zipCode: null,
              isSelected: true,
            },
          ],
        },
        projectTeam: [
          {
            id: '5',
            email: 'd_master_1@glozinc.com',
            firstName: 'Master',
            jobTitle: 'Translator',
            lastName: 'K',
            middleName: null,

            position: 'supervisor',

            userId: 5,
          },
          {
            id: '5',
            email: 'leriel@glozinc.com',
            firstName: 'leriel',
            jobTitle: 'Translator',
            lastName: 'Kim',
            middleName: null,

            position: 'projectManager',

            userId: 6,
          },
          {
            id: '5',
            email: 'bon@glozinc.com',
            firstName: 'bon',
            jobTitle: 'Translator',
            lastName: 'Kim',
            middleName: null,

            position: 'teamMember',

            userId: 7,
          },
        ],
      },
    },
  ]

  return res
}
