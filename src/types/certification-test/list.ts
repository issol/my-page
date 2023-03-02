import { SelectType } from '../onboarding/list'

export type TestMaterialFilterType = {
  testType: { label: string; value: string }[]
  jobType: { label: string; value: string }[]
  role: { label: string; value: string; jobType: string[] }[]
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
}

export type TestMaterialFilterPayloadType = {
  userCompany: string
  take: number
  skip: number
  role?: string[]
  jobType?: string[]
  testType?: string[]
  source: string[]
  target: string[]
}

export type TestMaterialListType = {
  id: number
  testType: string
  jobType: string
  source: string
  target: string
  role: string
  createdAt: string
  updatedAt: string
}

export const TestType: SelectType[] = [
  {
    value: 'Skill test',
    label: 'Skill test',
  },
  {
    value: 'Basic test',
    label: 'Basic test',
  },
]
