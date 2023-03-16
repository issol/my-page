export type ProFilterType = {
  jobType: { label: string; value: string }[]
  role: { label: string; value: string; jobType: string[] }[]
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  experience: { label: string; value: string }[]
  status: { label: string; value: string }[]
  clients: { label: string; value: string }[]
  search: string
}

export type ProListFilterType = {
  take: number
  skip: number
  status?: string[]
  clients?: string[]
  role?: string[]
  jobType?: string[]
  search?: string
  source?: string[]
  target?: string[]
  experience?: string[]
  order?: string
}
