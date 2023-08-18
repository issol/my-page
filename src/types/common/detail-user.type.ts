import {
  AppliedRoleType,
  OnboardingProDetailsType,
} from '../onboarding/details'
import { ClientAddressType } from '../schema/client-address.schema'

export interface DetailUserType extends OnboardingProDetailsType {
  dateOfBirth?: string
  status?: string
  address: ClientAddressType<number>
  isOffOnWeekends: boolean
  appliedRoles: Array<AppliedRoleType>
}
