import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type PriceFormType = {
  isBasePrice: boolean
  priceUnit: string
  unit: string
  weighting: number | null
  isActive: boolean
  subPrice?: Array<{
    isSubPrice: boolean
    priceUnit: string
    unit: string
    weighting: null | number
    isActive: boolean
  }>
}
export const priceUnitSchema = yup.object().shape({
  isBasePrice: yup.boolean().required(),
  priceUnit: yup.string().required(),
  unit: yup.string().nullable(),
  weighting: yup
    .number()
    .nullable()
    .when('isBasePrice', (isBasePrice, schema) =>
      !isBasePrice ? schema : yup.number().required(),
    ),
  subPrice: yup
    .array()
    .min(1, FormErrors.required)
    .of(
      yup.object().shape({
        isSubPrice: yup.boolean(),
        priceUnit: yup.string().required(),
        unit: yup.string().nullable(),
        weighting: yup.number().min(1).required(),
      }),
    )
    .when('isBasePrice', (isBasePrice, schema) => {
      return isBasePrice ? schema : yup.array().nullable()
    }),
})
