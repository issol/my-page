import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type ClientFormType = {
  clientId: number | null
  contactPersonId: number | null
  addressType: 'billing' | 'shipping'
}

export const clientSchema = yup.object().shape({
  clientId: yup.number().required(FormErrors.required),
  contactPersonId: yup.number().required(FormErrors.required),
  addressType: yup
    .string()
    .oneOf(['shipping', 'billing'])
    .required(FormErrors.required),
})
