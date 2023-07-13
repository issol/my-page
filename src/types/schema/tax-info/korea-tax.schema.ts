import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const koreaTaxSchema = yup.object().shape({
  businessNumber: yup
    .number()
    .typeError(FormErrors.invalidNumber)
    .required(FormErrors.required),
  companyName: yup.string().required(FormErrors.required),
  representativeName: yup.string().required(FormErrors.required),
  businessAddress: yup.string().required(FormErrors.required),
  businessType: yup.string().required(FormErrors.required),
  recipientEmail: yup
    .string()
    .email(FormErrors.invalidEmail)
    .required(FormErrors.required),
})
