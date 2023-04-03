import { generateRandomCalendarData } from '@src/@fake-db/project-calendar'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export type SortingType = 'DESC' | 'ASC'
export type FilterType = {
  title?: Array<string>
  role?: Array<string>
  status?: Array<string>
  source?: Array<string>
  target?: Array<string>
  client?: Array<string>
  sort?: SortingType
  skip: number
  take: number
}

export type ProProjectType = {
  id: number
  title: string
  role: string
  client: string
  sourceLanguage: string
  targetLanguage: string
  dueDate: string
  status: string
  timezone: string
  projectName: string
  orderDate: string
  deliveredDate?: string | null
  description: string
  category: string
  projectId: string
}

export const getProProjectList = async (
  id: number,
  filters: FilterType,
): Promise<{
  data: Array<ProProjectType> | []
  totalCount: number
}> => {
  try {
    // const { data } = await axios.get(`/api${id}?${makeQuery({ ...filters, company: 'GloZ' })}`)
    // return data
    return {
      data: [
        {
          id: 1,
          title: 'Red Wood',
          role: 'Copywriter',
          client: 'Sandbox',
          sourceLanguage: 'en',
          targetLanguage: 'ko',
          dueDate: Date(),
          status: 'Invoice created',
          timezone: 'KST',
          projectName: 'Red wood..',
          orderDate: Date(),
          description: '알라깔라 똑깔라비',
          category: 'Dubbing',
          projectId: 'AAA-XXX',
        },
      ],
      totalCount: 3,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

export type ProjectCalendarData = {
  data: Array<CalendarEventType>
  totalCount: number
}

export type CalendarEventType = ProProjectType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getProjectCalendarData = async (
  id: number,
  date: string,
): Promise<ProjectCalendarData> => {
  const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']
  const color_overdue = 'overdue'

  try {
    // const { data } = await axios.get(`/api${id}&year=${year}&month=${month}`)
    // return data

    const [year, month] = date.split('-')
    const result = generateRandomCalendarData(Number(year), Number(month), 10)
    return {
      data: result.map((item: ProProjectType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar:
              item.status === 'Overdue'
                ? color_overdue
                : colors[idx % colors.length],
          },
          allDay: true,
        }
      }),
      totalCount: result.length,
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getProProjectListMyPeriod = async (
  id: number,
  month: number,
  year: number,
): Promise<{
  data: Array<ProProjectType> | []
  totalCount: number
}> => {
  try {
    // const { data } = await axios.get(`/api${id}`)
    // return data
    return {
      data: [],
      totalCount: 0,
    }
  } catch (e: any) {
    throw new Error(e)
  }
}
