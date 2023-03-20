import { ProProjectType } from '@src/apis/pro-projects.api'

function getRandomDate(start: Date, end: Date): Date {
  const randomMs =
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomMs)
}

export function generateRandomCalendarData(
  year: number,
  month: number,
  numOfData: number,
): Array<ProProjectType> {
  let calendarData: Array<ProProjectType> = []
  const status = [
    // 'Approved',
    // 'Assigned-waiting',
    'Canceled',
    'Delivered',
    'In progress',
    // 'Invoice accepted',
    'Overdue',
    // 'Paid',
    // 'Requested',
    // 'Without invoice',
  ]
  for (let i = 0; i < numOfData; i++) {
    const numOfEvents = Math.ceil(Math.random() * 10)
    const events: Array<ProProjectType> = []

    for (let j = 0; j < numOfEvents; j++) {
      const title = `Event ${j + 1}`
      const start = getRandomDate(
        new Date(year, month, 1),
        new Date(year, month, 31),
      )
      const end = getRandomDate(start, new Date(year, month, 31))
      events.push({
        id: j,
        title,
        role: 'Audio describer',
        client: 'GloZ',
        sourceLanguage: 'en',
        targetLanguage: 'ko',
        status: status[j % status.length],
        timezone: 'KST',
        projectName: title,
        orderDate: start.toISOString(),
        description: `${j}번째 이야기`,
        category: 'Webnovel',
        projectId: `${i}-XXX`,
        dueDate: end.toISOString(),
      })
    }
    calendarData = events
  }

  return calendarData
}
