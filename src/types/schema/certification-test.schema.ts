import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type TestMaterialPostType = {
  testType: string
  googleFormLink: string
  source: { label: string; value: string }
  target: { label: string; value: string }
  jobType: { label: string; value: string }
  role: { label: string; value: string }
  file: Array<File>
}

export const certificationTestSchema = yup.object().shape({
  testType: yup.string().required(FormErrors.required),
  googleFormLink: yup
    .string()
    .required(FormErrors.required)
    .matches(
      /^((http(s?))\:\/\/(docs.google.com(\?|\/)forms|forms.gle)(\?|\/))/,
      'Not a Google form link',
    ),

  source: yup
    .object()
    .shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
    })
    .when('testType', (testType, schema) =>
      testType === 'Basic test' ? yup.object().nullable() : schema,
    ),
  jobType: yup
    .object()
    .shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
    })
    .when('testType', (testType, schema) =>
      testType === 'Basic test' ? yup.object().nullable() : schema,
    ),
  role: yup
    .object()
    .shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
    })
    .when('testType', (testType, schema) =>
      testType === 'Basic test' ? yup.object().nullable() : schema,
    ),
  target: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),

  // content: yup.string().required(errorMsg.required),
  file: yup.array().nullable(),
})
