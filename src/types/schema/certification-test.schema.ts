import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type TestMaterialPostType = {
  testType: string
  googleFormLink: string
  source: Array<{ label: string; value: string }>
  target: Array<{ label: string; value: string }>
  jobType: { label: string; value: string }
  role: { label: string; value: string }
  file: Array<File>
}

// TODO : 타입 상으로는 아래처럼 해야 적용되는데 실제로도 제대로 동작하는지 확인 필요
export const certificationTestSchema = yup.object().shape({
  testType: yup.string().required(FormErrors.required),
  googleFormLink: yup
    .string()
    .required(FormErrors.required)
    .matches(
      /^((http(s?))\:\/\/(docs.google.com(\?|\/)forms|forms.gle)(\?|\/))/,
      'Not a Google form link',
    )
    .matches(/edit$/, 'Please enter the edit link of the Google form'),

  source: yup.array().of(
    yup
      .object({
        label: yup.string().required(FormErrors.required),
        value: yup.string().required(FormErrors.required),
      })
      .when('testType', ([testType], schema) =>
        testType === 'Basic test' ? yup.object().nullable() : schema,
      ),
  ),
  jobType: yup
    .object()
    .shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
    })
    .when('testType', ([testType], schema) =>
      testType === 'Basic test' ? yup.object().nullable() : schema,
    ),
  role: yup
    .object()
    .shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
    })
    .when('testType', ([testType], schema) =>
      testType === 'Basic test' ? yup.object().nullable() : schema,
    ),
  target: yup.array().of(
    yup.object().shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
    }),
  ),

  // content: yup.string().required(errorMsg.required),
  file: yup.array().nullable(),
})
