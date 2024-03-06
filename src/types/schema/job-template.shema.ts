import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const JobTemplateFormSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  description: yup.string().nullable(),
  options: yup.array().of(
    yup.object().shape({
      serviceTypeId: yup.number().required(FormErrors.required),
      order: yup.number().required(FormErrors.required),
      autoNextJob: yup.string().oneOf(['1', '0']).required(FormErrors.required),
      statusCodeForAutoNextJob: yup.number().required(FormErrors.required),
      autoSharingFile: yup
        .string()
        .oneOf(['1', '0'])
        .required(FormErrors.required),
    }),
  ),
})
