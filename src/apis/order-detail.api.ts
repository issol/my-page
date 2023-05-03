import axios from '@src/configs/axios'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import {
  ClientType,
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
          projectDueAtTimezone: {
            code: 'string',
            label: 'string',
            phone: 'string',
          },
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
