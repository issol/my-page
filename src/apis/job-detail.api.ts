import axios from '@src/configs/axios'
import {
  AssignProFilterPostType,
  AssignProListType,
} from '@src/types/orders/job-detail'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getAssignProList = async (
  filters: AssignProFilterPostType,
): Promise<{ totalCount: number; data: AssignProListType[] }> => {
  // const { data } = await axios.get(
  //   `/api/enough/u/pro/job?${makeQuery(filters)}`,
  // )

  const res: AssignProListType[] = [
    {
      id: '1',
      firstName: 'Kim',
      middleName: 'Minji',
      lastName: 'Leriel',
      email: 'leriel@glozinc.com',
      status: 'Onboard',
      responseRate: 20,
      assignmentStatus: 'Request accepted',
      assignmentDate: '2022-05-17T14:13:15Z',
      message: {
        id: 0,
        unReadCount: 1,
        contents: [
          {
            id: 0,
            firstName: 'Kim',
            middleName: null,
            lastName: 'Minji',
            email: 'leriel@glozinc.com',
            role: 'Pro',
            content: 'Hello',
            createdAt: '2022-05-17T14:13:15Z',
          },
        ],
      },
    },
    {
      id: '2',
      firstName: 'Kim',
      middleName: 'Minji',
      lastName: 'Leriel',
      email: 'leriel@glozinc.com',
      status: 'Onboard',
      responseRate: 30,
      assignmentStatus: 'Requested',
      assignmentDate: null,
      message: {
        id: 0,
        unReadCount: 2,
        contents: null,
      },
    },
  ]

  const data = {
    totalCount: res.length,
    data: res,
  }

  return data
}
