import axios from '@src/configs/axios'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { ItemResType } from '@src/types/common/orders-and-quotes.type'
import {
  JobPricesDetailType,
  ProJobDetailType,
} from '@src/types/jobs/jobs.type'
import {
  AssignProFilterPostType,
  AssignProListType,
  SaveJobInfoParamsType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getAssignProList = async (
  id: number,
  filters: AssignProFilterPostType,
  isHistory: boolean,
): Promise<{
  totalCount: number
  data: AssignProListType[]
  count: number
}> => {
  const { data } = isHistory
    ? await axios.get(`/api/enough/u/job/${id}/request/history`)
    : await axios.get(`/api/enough/u/pro/job/${id}?${makeQuery(filters)}`)

  return data
}

export const getJobDetails = async (
  id: number,
): Promise<{
  id: number
  cooperationId: string
  items: JobItemType[]
}> => {
  try {
    const { data } = await axios.get(`/api/enough/u/job/detail?orderId=${id}`)
    // console.log(data)

    return data
  } catch (e: any) {
    return {
      id: 0,
      cooperationId: '0',
      items: [],
    }
  }
}

export const getJobInfo = async (
  id: number,
  isHistory: boolean,
): Promise<JobType> => {
  try {
    const { data } = isHistory
      ? await axios.get(`/api/enough/u/job/history/${id}`)
      : await axios.get(`/api/enough/u/job/${id}/info`)
    // console.log(data)

    return data
  } catch (e: any) {
    return {
      id: 0,
      order: { id: -1 },
      corporationId: '',
      name: '',
      status: 'In preparation',
      contactPersonId: 0,
      serviceType: '',
      sourceLanguage: '',
      targetLanguage: '',
      startedAt: '',
      dueAt: '',
      totalPrice: 0,
      startTimezone: {
        code: '',
        label: '',
        phone: '',
      },
      dueTimezone: { code: '', label: '', phone: '' },
      description: '',
      isShowDescription: false,
      contactPerson: null,
    }
  }
}

export const saveJobInfo = async (id: number, data: SaveJobInfoParamsType) => {
  await axios.patch(`/api/enough/u/job/${id}`, { ...data })
}

export const deleteJob = async (id: number) => {
  await axios.delete(`/api/enough/u/job/${id}`)
}

export const getJobPrices = async (
  id: number,
  isHistory: boolean,
): Promise<JobPricesDetailType> => {
  try {
    const { data } = isHistory
      ? await axios.get(`/api/enough/u/job/history/${id}/price`)
      : await axios.get(`/api/enough/u/job/${id}/price`)
    // console.log(data)

    return {
      ...data,
      datas:
        data?.datas?.map((item: ItemResType) => ({
          ...item,
          name: item?.itemName,
          source: item?.sourceLanguage,
          target: item?.targetLanguage,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
        })) || [],
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const saveJobPrices = async (
  id: number,
  data: SaveJobPricesParamsType,
) => {
  await axios.patch(`/api/enough/u/job/${id}/price`, { ...data })
}

export const requestJobToPro = async (ids: number[], jobId: number) => {
  await axios.post(`/api/enough/u/job/${jobId}/request`, { proIds: ids })
}

export const getMessageList = async (
  jobId: number,
  proId: number,
): Promise<{
  unReadCount: number
  contents:
    | {
        id: number
        content: string
        createdAt: string
        firstName: string
        middleName: string | null
        lastName: string
        email: string
        role: string
      }[]
    | null
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/${jobId}/message?proId=${proId}`,
    )
    return data
  } catch (e: any) {
    return {
      unReadCount: 0,
      contents: null,
    }
  }
}

export const sendMessageToPro = async (
  jobId: number,
  proId: number,
  message: string,
) => {
  await axios.post(`/api/enough/u/job/${jobId}/message`, {
    proId: proId,
    message: message,
  })
}

export const uploadFile = async (file: {
  jobId: number
  size: number
  name: string
  type: 'SAMPLE' | 'SAMPLE' | 'TARGET'
}) => {
  await axios.post(`/api/enough/u/job/upload`, { ...file })
}

export const getSourceFileToPro = async (
  jobId: number,
): Promise<FileType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/source-file?jobId=${jobId}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const getProJobDetail = async (
  id: number,
): Promise<ProJobDetailType> => {
  try {
    const testProJobDetail: ProJobDetailType = {
      id: 1,
      corporationId: 'ABC123',
      status: 'Delivered to LPM',
      name: 'The Remarried Empress EP 1 TRA',
      client: {
        clientId: 1,
        email: 'client@example.com',
        fax: null,
        mobile: '+1 123-456-7890',
        phone: '+1 123-456-7890',
        timezone: {
          phone: '+1',
          code: 'US',
          label: 'America/New_York',
        },
        name: 'Example Client',
        taxable: true,
        tax: 10,
      },
      contactPerson: {
        id: 1,
        personType: 'Mr.',
        firstName: 'John',
        middleName: null,
        lastName: 'Doe',
        department: null,
        jobTitle: 'Manager',
        timezone: {
          phone: '+1',
          code: 'US',
          label: 'America/New_York',
        },
        email: 'johndoe@example.com',
        phone: '+1 123-456-7890',
        mobile: null,
        fax: null,
        memo: 'Some notes about John Doe',
        isReferred: false,
        userId: null,
      },
      category: 'Documents/Text',
      serviceType: 'Translation',
      sourceLanguage: 'en',
      targetLanguage: 'fr',
      requestedAt: '2022-01-01T00:00:00.000Z',
      dueAt: '2022-01-10T00:00:00.000Z',
      startedAt: '2023-08-10T00:00:00.000Z',
      price: {
        data: [
          {
            priceUnitId: 1,
            priceUnit: 'word',
            quantity: 1000,
            unitPrice: 0.05,
            prices: 50,
            unit: 'word',
            currency: 'USD',
            priceFactor: null,
          },
        ],
        totalPrice: 200,
        isUsedCAT: false,
      },
      description: 'Some notes about the job',
      files: [
        {
          name: 'file1.txt',
          size: 1024,
          type: 'SOURCE',
          file: 'https://example.com/files/file1.txt',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file2.jpg',
          size: 2048,
          type: 'TARGET',
          file: 'https://example.com/files/file2.jpg',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file3.pdf',
          size: 3072,
          type: 'SOURCE',
          file: 'https://example.com/files/file3.pdf',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file4.docx',
          size: 4096,
          type: 'SAMPLE',
          file: 'https://example.com/files/file4.docx',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file5.xlsx',
          size: 5120,
          type: 'TARGET',
          file: 'https://example.com/files/file5.xlsx',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file6.pptx',
          size: 6144,
          type: 'SAMPLE',
          file: 'https://example.com/files/file6.pptx',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file7.zip',
          size: 7168,
          type: 'SAMPLE',
          file: 'https://example.com/files/file7.zip',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file8.mp4',
          size: 8192,
          type: 'TARGET',
          file: 'https://example.com/files/file8.mp4',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file9.png',
          size: 9216,
          type: 'SAMPLE',
          file: 'https://example.com/files/file9.png',
          createdAt: '2023-08-30T17:13:15Z',
        },
        {
          name: 'file10.gif',
          size: 10240,
          type: 'SAMPLE',
          file: 'https://example.com/files/file10.gif',
          createdAt: '2023-08-30T17:13:15Z',
        },
      ],
      guideLines: {
        id: 1,
        version: 1,
        userId: 1,
        title: 'Test Guideline',
        writer: 'John Doe',
        email: 'johndoe@example.com',
        client: 'Example Client',
        category: 'Translation',
        serviceType: 'Document',
        updatedAt: '2022-01-01T00:00:00.000Z',
        content: {
          blocks: [
            {
              key: '33kfr',
              data: {},
              text: 'TEST GUIDELINE',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
          ],
          entityMap: {},
        },
        files: [
          {
            id: 1,
            name: 'file1.txt',
            size: 1024,
            type: 'text/plain',
            file: 'https://example.com/files/file1.txt',
            createdAt: '2022-01-01T00:00:00.000Z',
          },
          {
            id: 2,
            name: 'file2.jpg',
            size: 2048,
            type: 'image/jpeg',
            file: 'https://example.com/files/file2.jpg',
            createdAt: '2022-01-02T00:00:00.000Z',
          },
        ],
      },
      deliveries: [
        {
          id: 1,
          deliveredDate: '2022-01-01T00:00:00.000Z',
          files: [
            {
              name: 'testFile.txt',
              size: 1024,
              file: 'https://example.com/files/testFile.txt',
              type: 'SAMPLE',
              createdAt: '2022-01-01T00:00:00.000Z',
              updatedAt: '2022-01-01T00:00:00.000Z',
            },
          ],
          note: 'Some note about the delivery',
        },
      ],
      feedbacks: [
        {
          id: 1,
          isChecked: false,
          name: 'John Doe',
          email: 'johndoe@example.com',
          createdAt: '2022-01-01T00:00:00.000Z',
          feedback: 'Some feedback about the job',
        },
      ],
    }
    return testProJobDetail
  } catch (error: any) {
    throw new Error(error)
  }
}
