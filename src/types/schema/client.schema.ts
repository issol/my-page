import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type ClientFormType = {
  clientId: number | null
  contactPersonId: number | 'Not applicable' | null
  addressType: 'billing' | 'shipping'
}

export const clientSchema = yup.object().shape({
  clientId: yup.number().required(FormErrors.required),
  contactPersonId: yup
    .mixed()
    .test('valid-contactPersonId', FormErrors.required, value =>
      customValidation(value),
    ),
  addressType: yup
    .string()
    .oneOf(['shipping', 'billing'])
    .required(FormErrors.required),
})

const customValidation = (value: any) => {
  return value === 'Not applicable' || (!isNaN(value) && !!value)
}
