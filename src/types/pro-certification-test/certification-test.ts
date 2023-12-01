export type ProCertificationTestFilterType = {
  jobType?: string[]
  role?: string[]
  sourceLanguage?: string[]
  targetLanguage?: string[]
  skip: number
  take: number
}

export type ProCertificationTestListType = {
  id: number
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  basicTest: {
    isExist: boolean
  }
}
