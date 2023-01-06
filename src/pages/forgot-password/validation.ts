import * as yup from 'yup'

export default function useForgotPasswordSchema() {
  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email address')
      .required('This field is required'),
  })
  return forgotPasswordSchema
}
