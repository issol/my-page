import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type PriceFormType = {
  isBase: boolean
  title: string
  unit: string
  weighting: number | null
  isActive: boolean
  subPriceUnits?: Array<{
    // isSubPrice: boolean
    title: string
    unit: string
    weighting: null | number
    isActive: boolean
  }>
}
export const priceUnitSchema = yup.object().shape({
  isBase: yup.boolean().required(),
  title: yup.string().required(),
  unit: yup.string().nullable(),
  weighting: yup
    .number()
    .nullable()
    .when('isBase', (isBase, schema) =>
      !isBase ? schema : yup.number().required(),
    ),
  subPriceUnits: yup
    .array()
    .min(1, FormErrors.required)
    .of(
      yup.object().shape({
        title: yup.string().required(),
        unit: yup.string().nullable(),
        weighting: yup.number().required(),
      }),
    )
    .when('isBase', (isBase, schema) => {
      return isBase ? schema : yup.array().nullable()
    }),
})

export const languagePairSchema = yup.object().shape({
  pair: yup.array().of(
    yup.object().shape({
      source: yup.string().required(FormErrors.required),
      target: yup.string().required(FormErrors.required),
      priceFactor: yup
        .mixed()
        .test('is-valid-input', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/

          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('is-integer-or-decimal', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/
          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('valid-number', 'Invalid number', value => {
          if (value === '-') {
            return true
          }
          return !value || !isNaN(Number(value))
        })
        .required(FormErrors.required),
      minimumPrice: yup
        .mixed()
        .test('is-valid-input', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/

          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('is-integer-or-decimal', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/
          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('valid-number', 'Invalid number', value => {
          if (value === '-') {
            return true
          }
          return !value || !isNaN(Number(value))
        }),
    }),
  ),
})

export const setPriceUnitSchema = yup.object().shape({
  pair: yup.array().of(
    yup.object().shape({
      price: yup
        .mixed()
        .test('is-valid-input', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/

          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('is-integer-or-decimal', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/
          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('valid-number', 'Invalid number', value => {
          if (value === '-') {
            return true
          }
          return !value || !isNaN(Number(value))
        })
        .required(FormErrors.required),
      quantity: yup
        .mixed()

        .test('is-valid-input', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/

          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('is-integer-or-decimal', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/
          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('valid-number', 'Invalid number', value => {
          if (value === '-') {
            return true
          }
          return !value || !isNaN(Number(value))
        })

        .required(FormErrors.required),
      weighting: yup
        .mixed()
        .test('is-valid-input', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/

          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('is-integer-or-decimal', 'Invalid number', value => {
          const regex = /^-?(?!.*--)[\d.-]+$/
          return !value || regex.test(value.toString()) // 입력값이 falsy인 경우나 숫자형이면 통과
        })
        .test('valid-number', 'Invalid number', value => {
          if (value === '-') {
            return true
          }
          return !value || !isNaN(Number(value))
        })
        .required(FormErrors.required),
    }),
  ),
})
