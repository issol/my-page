import * as yup from 'yup'

export default function useResetPasswordSchema() {
  const resetPasswordSchema = yup.object({
    password: yup
      .string()
      .required('required')
      .matches(/^.{9,20}$/, { message: 'characters', name: 'characters' })
      .matches(/(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/, {
        message: 'specialDigit',
        name: 'specialDigit',
      })
      .matches(/(?=.*?[a-z])(?=.*?[A-Z])/, {
        message: 'upperLower',
        name: 'upperLower',
      }),
    confirmPassword: yup
      .string()
      .label('confirm password')
      .required()
      .oneOf([yup.ref('password'), null], `Password doesn't match.`),
  })
  return resetPasswordSchema
}
