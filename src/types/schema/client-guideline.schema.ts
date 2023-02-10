import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/form-errors'

export type ClientGuidelineType = {
  title: string
  client: { label: string; value: string }
  category: { label: string; value: string }
  serviceType: { label: string; value: string }
  // content: any
  file: Array<File>
}
export const clientGuidelineSchema = yup.object().shape({
  title: yup.string().required(FormErrors.required),
  client: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),

  category: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  serviceType: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  // content: yup.string().required(errorMsg.required),
  resume: yup.array().nullable(),
})
