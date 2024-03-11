import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const linguistTeamSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  client: yup.string().nullable(),
  serviceTypeId: yup.number().required(FormErrors.required),
  sourceLanguage: yup.string().required(FormErrors.required),
  targetLanguage: yup.string().required(FormErrors.required),
  description: yup.string().nullable(),
  isPrivate: yup.boolean().required(FormErrors.required),
})
