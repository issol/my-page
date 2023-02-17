import * as yup from 'yup'
import { checkEmailDuplication } from 'src/apis/sign.api'
import { FormErrors } from 'src/shared/const/formErrors'

export default function useForgotPasswordSchema() {
  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email address')
      .test(
        'email-duplication',
        'This email address is not registered',
        (val: any) => {
          return new Promise((resolve, reject) => {
            checkEmailDuplication(val)
              .then(res => {
                resolve(false)
              })
              .catch((e: any) => {
                resolve(true)
              })
          })
        },
      )
      .required(FormErrors.required),
  })
  return forgotPasswordSchema
}
