import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type PayPalFormType = {
  email: string
}

export const payPalSchema = yup.object().shape({
  email: yup
    .string()
    .email(FormErrors.invalidEmail)
    .required(FormErrors.required),
})
