export const DueDateForFilter = [
  { value: '0', label: 'Less than 1 day left' },
  { value: '2', label: '1-2 days left' },
  { value: '3', label: '3-6 days left' },
  { value: '9', label: '1 week left' },
  { value: '10', label: '1-2 weeks left' },
  { value: '11', label: '2 weeks and more' },
] as const

export const PostedDateForFilter = [
  { value: '0', label: 'last 24 hours' },
  { value: '2', label: 'last 48 hours' },
  { value: '3', label: 'last week' },
  { value: '9', label: 'last 2 weeks' },
  { value: '10', label: 'last month' },
] as const
