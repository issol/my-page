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
