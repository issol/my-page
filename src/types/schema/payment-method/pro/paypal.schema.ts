import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const payPalDefaultValue = {
  email: '',
  personalId: '',
}

export const payPalSchema = yup.object().shape({
  email: yup
    .string()
    .email(FormErrors.invalidEmail)
    .required(FormErrors.required),
  personalId: yup.string().required(FormErrors.required),
  copyOfId: yup.mixed().required(FormErrors.required),
})
