import axios from '@src/configs/axios'
import { FilterType } from '@src/pages/orders/job-list/list-view/list-view'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  JobsListType,
  JobsTrackerDetailType,
  JobsTrackerListType,
} from '@src/types/jobs/get-jobs.type'

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
export const getJobsTrackerList = async (
  filter: FilterType,
): Promise<{ data: JobsTrackerListType[]; totalCount: number }> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?${makeQuery(filter)}`,
    // )
    // return data
    return {
      data: [
        {
          id: 1,
          client: { name: 'bon', email: 'bon@glozinc.com' },
          name: 'Job name',
          category: 'Dubbing',
          serviceType: ['DTP', 'Audio description'],
          currency: 'KRW',
          totalPrice: 123123123,
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
export const getJobsTrackerDetail = async (
  id: number,
  filter: FilterType,
): Promise<{
  workName: string
  data: JobsTrackerDetailType[]
  totalCount: number
}> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?${makeQuery(filter)}`,
    // )
    // return data
    return {
      workName: 'job Name',
      data: [
        {
          id: 1,
          isDelivered: true,
          name: 'Jobs',
          itemDueDate: Date(),
          contactPerson: { id: 12, name: 'bon' },
          jobDueDate: Date(),
          assignedPro: {
            id: 1,
            name: 'Kitty',
            jobTitle: 'Manager',
            email: 'bon@glozinc.com',
            isActive: true,
            isOnboarded: true,
          },
          serviceType: 'DTP',
          source: 'en',
          target: 'ko',
        },
      ],
      totalCount: 1,
    }
  } catch (error) {
    return {
      workName: '',
      data: [],
      totalCount: 0,
    }
  }
}

export const updateIsDelivered = async (
  isDelivered: boolean,
  trackerId: number,
) => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?${makeQuery(filter)}`,
    // )
    // return data
  } catch (error: any) {
    throw new Error(error)
  }
}
