import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const accountMethodSchema = yup.object().shape({
  account: yup.string().required(FormErrors.required),
})
