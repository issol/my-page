export type JobOpeningListType = {
  id: number
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  yearsOfExperience: string
  dueDate: string
  dueDateTimezone: string
}

export type JobOpeningListFilterType = {
  jobType?: string[]
  role?: string[]
  source?: string[]
  target?: string[]
  experience?: string[]
  dueDate?: string[]
  postedDate?: string[]

  skip: number
  take: number
}
