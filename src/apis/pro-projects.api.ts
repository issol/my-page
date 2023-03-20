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
  status: string
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getProjectCalendarData = async (
  id: number,
  year: number,
  month: number,
): Promise<ProjectCalendarData> => {
  const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']

  try {
    // const { data } = await axios.get(`/api${id}&year=${year}&month=${month}`)
    // return data
    const result = generateRandomCalendarData(year, month, 10)
    return {
      id: result.id,
      events: result.events.map((item: any, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: colors[idx % colors.length],
          },
          allDay: true,
        }
      }),
    }
    // return generateRandomCalendarData(year, month, 10)
  } catch (e: any) {
    throw new Error(e)
  }
}
