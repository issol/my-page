import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const offDaySchema = yup.object().shape({
  start: yup.date().required(FormErrors.required),
  end: yup.date().required(FormErrors.required),
  reason: yup.string().required(FormErrors.required),
})
