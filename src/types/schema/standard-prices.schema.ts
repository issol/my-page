import { FormErrors } from '@src/shared/const/formErrors'
import * as yup from 'yup'

export const standardPricesSchema = yup.object().shape({
  priceName: yup.string().required(FormErrors.required),
  category: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  // category: yup.mixed().oneOf([null, undefined], 'Please select a category'),

  serviceType: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        label: yup.string().required(FormErrors.required),
        value: yup.string().required(FormErrors.required),
      }),
    ),
  currency: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  catBasis: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  decimalPlace: yup
    .mixed()
    .test('is-valid-input', 'Invalid number', value => {
      const regex = /^-?(?!.*--)[\d.-]+$/

      return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
    })
    .test('is-integer-or-decimal', 'Invalid number', value => {
      const regex = /^-?(?!.*--)[\d.-]+$/
      return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
    })
    .required(FormErrors.required),
  roundingProcedure: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.number().required(FormErrors.required),
  }),
  memoForPrice: yup.string(),
})
