export type ProCertificationTestFilterType = {
  jobType?: string[]
  role?: string[]
  source?: string[]
  target?: string[]
  skip: number
  take: number
}

export type ProCertificationTestListType = {
  id: number
  jobType: string
  role: string
  source: string
  target: string
  basicTest: {
    isExist: boolean
  }
}
