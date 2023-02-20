import { OnboardingUserType } from './list'

export interface OnboardingProDetailsType extends OnboardingUserType {
  corporationId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  fromSNS: boolean | null
  havePreferredName: boolean
  company: string
}
