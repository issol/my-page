import {
  CalendarEventType,
  ProjectCalendarData,
} from '@src/apis/pro-projects.api'

function getRandomDate(start: Date, end: Date): Date {
  const randomMs =
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomMs)
}

export function generateRandomCalendarData(
  year: number,
  month: number,
  numOfData: number,
): ProjectCalendarData {
  let calendarData: ProjectCalendarData = { id: 0, events: [] }

  for (let i = 0; i < numOfData; i++) {
    const numOfEvents = Math.ceil(Math.random() * 10)
    const events: Array<CalendarEventType> = []

    for (let j = 0; j < numOfEvents; j++) {
      const title = `Event ${j + 1}`
      const start = getRandomDate(
        new Date(year, month, 1),
        new Date(year, month, 31),
      )
      const end = getRandomDate(start, new Date(year, month, 31))
      events.push({
        id: Math.random(),
        title,
        start: start.toISOString(),
        end: end.toISOString(),
      })
    }
    calendarData = { id: i, events }
  }

  return calendarData
}
