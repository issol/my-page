export type ClientProjectFilterType = {
  take: number
  skip: number
  search?: string
  projectType?: string[]
  category?: string[]
  serviceType?: string[]
  status?: string[]
  dueDate?: Date[]
  sort?: string
}
