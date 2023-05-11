import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'
import { ClientAddressType } from './client-address.schema'

export type ClientFormType = {
  clientId: number | null
  contactPersonId: number | null
  addressType: 'billing' | 'shipping'
  /* contacts값은 서버에는 보내지 않고 보여주기용 데이터 */
  contacts?: {
    timezone?: CountryType
    phone?: string | null
    mobile?: string | null
    fax?: string | null
    email?: string | null
    addresses?: ClientAddressType[]
  }
}

export const clientSchema = yup.object().shape({
  clientId: yup.number().required(FormErrors.required),
  contactPersonId: yup.number().required(FormErrors.required),
  addressType: yup
    .string()
    .oneOf(['shipping', 'billing'])
    .required(FormErrors.required),
})
