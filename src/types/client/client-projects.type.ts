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
  hideCompletedProject?: boolean
}

export type ClientProjectListType = {
  id: number
  qId: string
  workName: string
  projectName: string
  category: string
  serviceType: Array<string>
  dueDate: string
  status: string
  orderDate: string
  projectDescription: string
}
