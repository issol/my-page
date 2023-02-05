import * as yup from 'yup'

const errorMsg = {
  required: 'This field is required.',
} as const

export type ClientGuidelineType = {
  title: string
  client: { label: string; value: string }
  category: { label: string; value: string }
  serviceType: { label: string; value: string }
  content: any
  file: Array<File>
}
export const clientGuidelineSchema = yup.object().shape({
  title: yup.string().required(errorMsg.required),
  client: yup.object().shape({
    label: yup.string().required(errorMsg.required),
    value: yup.string().required(errorMsg.required),
  }),

  category: yup.object().shape({
    label: yup.string().required(errorMsg.required),
    value: yup.string().required(errorMsg.required),
  }),
  serviceType: yup.object().shape({
    label: yup.string().required(errorMsg.required),
    value: yup.string().required(errorMsg.required),
  }),
  content: yup.string().required(errorMsg.required),
  resume: yup.array().nullable(),
})
