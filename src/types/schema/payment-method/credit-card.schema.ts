import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const creditCardSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(
      /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      FormErrors.invalidCardNumber,
    ),
  validDueAt: yup.string().required(FormErrors.required),
})
