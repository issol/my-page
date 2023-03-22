import { OnboardingProDetailsType } from '../onboarding/details'

export interface DetailUserType extends OnboardingProDetailsType {
  dateOfBirth?: string
  status?: string
  residence?: string
  availableDate?: Array<Date>
  offDate?: Array<Date>
}
