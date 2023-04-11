import {
  CertifiedRoleType,
  OnboardingProDetailsType,
} from '../onboarding/details'
import { OnboardingJobInfoType } from '../onboarding/list'

export interface DetailUserType extends OnboardingProDetailsType {
  dateOfBirth?: string
  status?: string
  residence?: string
  appliedRoles?: Array<OnboardingJobInfoType>
  certifiedRoles?: Array<CertifiedRoleType>
  roles?: Array<any>
}
