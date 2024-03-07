import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const linguistTeamSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  client: yup.string().nullable(),
  serviceType: yup.number().required(FormErrors.required),
  source: yup.string().required(FormErrors.required),
  target: yup.string().required(FormErrors.required),
  description: yup.string().nullable(),
  isPrivate: yup.boolean().required(FormErrors.required),
})
