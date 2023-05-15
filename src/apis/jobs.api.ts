import axios from '@src/configs/axios'
import { FilterType } from '@src/pages/orders/job-list/list-view/list-view'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { JobsListType } from '@src/types/jobs/get-jobs.type'

export const getJobsList = async (
  filter: FilterType,
): Promise<{ data: JobsListType[]; totalCount: number }> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?${makeQuery(filter)}`,
    // )
    // return data
    return {
      data: [
        {
          id: '123',
          corporationId: 'O-000010-TRA-001', // O-000010-TRA-001
          status: 'Approved',
          client: {
            name: 'kim ga yeon',
            email: 'bon@glozinc.com',
          },
          jobName: 'Manager',
          category: 'Webnovel',
          serviceType: 'DTP',
          startedAt: Date(),
          dueAt: Date(),
          totalPrice: 20000,
          currency: 'KRW',
        },
      ],
      totalCount: 1,
    }
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
