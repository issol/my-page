import { generateRandomCalendarData } from '@src/@fake-db/project-calendar'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export type ProProjectType = {
  id: number
  workName: string
  role: string
  client: string
  sourceLanguage: string
  targetLanguage: string
  dueDate: string
  status: string
  timezone: string
  projectName: string
  orderDate: string
  description: string
  category: string
  projectId: string
}

export type ProjectCalendarData = {
  id: number
  events: Array<CalendarEventType>
}

export type CalendarEventType = {
  id: number
  title: string
  start: string
  end: string
  status?: string
}

export const getProjectCalendarData = async (
  id: number,
  year: number,
  month: number,
): Promise<ProjectCalendarData> => {
  try {
    // const { data } = await axios.get(`/api${id}&year=${year}&month=${month}`)
    // return data
    return generateRandomCalendarData(year, month, 10)
  } catch (e: any) {
    throw new Error(e)
  }
}
