import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const passwordDefaultValue = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}
export const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required(FormErrors.required),
  newPassword: yup
    .string()
    .min(9, '0')
    .max(20, '0')
    .matches(/[A-Z]/, '0')
    .matches(/[a-z]/, '0')
    .matches(/[0-9]/, '0')
    .matches(/[^A-Za-z0-9]/, '0')
    .required(FormErrors.required),
  //   confirmPassword: yup.string().required(FormErrors.required),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], FormErrors.passwordDoesntMatch)
    .required(FormErrors.required),
})
