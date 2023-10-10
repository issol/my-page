import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type ClientGuidelineType = {
  title: string
  client: { label: string; value: string }
  category: { label: string | null; value: string | null } | null
  serviceType: { label: string | null; value: string | null } | null
  file: Array<File>
}
export const clientGuidelineSchema = yup.object().shape({
  title: yup.string().required(FormErrors.required),
  client: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),

  category: yup.object().shape({
    label: yup.string().nullable().required(FormErrors.required),
    value: yup.string().nullable().required(FormErrors.required),
  }),
  serviceType: yup.object().shape({
    label: yup.string().nullable().required(FormErrors.required),
    value: yup.string().nullable().required(FormErrors.required),
  }),
  // content: yup.string().required(errorMsg.required),
  resume: yup.array().nullable(),
})
