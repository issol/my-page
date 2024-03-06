export type JobTemplateOptionParamsType = {
  serviceTypeId: number | null
  order: number
  autoNextJob: '1' | '0'
  statusCodeForAutoNextJob: number
  autoSharingFile: '1' | '0'
}

export type JobTemplateOptionType = {
  id: number
  serviceTypeId: number
  order: number
  autoNextJob: boolean
  statusCodeForAutoNextJob: number
  autoSharingFile: boolean
}

export type JobTemplateListType = {
  id: number
  name: string
  corporationId: string
  authorId: number
  options: Array<JobTemplateOptionType>
}

export type JobTemplateDetailType = {
  id: number
  name: string
  description: string
  corporationId: string
  authorId: number
  options: Array<JobTemplateOptionType>
  author: {
    userId: number
    firstName: string
    middleName: string | null
    lastName: string
    email: string
  }

  updatedAt: string
}

export type JobListFilterType = {
  serviceType?: number[]
  skip: number

  take: number
  search?: string
}

export type JobTemplateFormType = {
  name: string
  description: string
  options: Array<JobTemplateOptionParamsType>
}
