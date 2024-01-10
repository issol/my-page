import {
  AppliedRoleType,
  OnboardingProDetailsType,
} from '../onboarding/details'
import { ClientAddressType } from '../schema/client-address.schema'

export interface DetailUserType extends OnboardingProDetailsType {
  birthday?: string
  status?: string
  addresses: Array<ClientAddressType<number>>
  isOffOnWeekends: boolean
  appliedRoles: Array<AppliedRoleType>
  noteFromUser: string
}
