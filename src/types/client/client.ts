import { ClientAddressFormType } from '../schema/client-address.schema'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CompanyInfoFormType } from '../schema/company-info.schema'
import { CountryType } from '../sign/personalInfoTypes'

export type ClientDetailType = CompanyInfoFormType &
  ClientAddressFormType &
  ContactPersonType
