import {
  AppliedRoleType,
  CertifiedRoleType,
  OnboardingProDetailsType,
} from '../onboarding/details'
import { OnboardingJobInfoType } from '../onboarding/list'

export interface DetailUserType extends OnboardingProDetailsType {
  dateOfBirth?: string
  status?: string
  residence?: string
  isOffOnWeekends: boolean
  appliedRoles: Array<AppliedRoleType>
}
