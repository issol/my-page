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
  decimalPlace: yup.number().required(FormErrors.required),
  roundingProcedure: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  memoForPrice: yup.string(),
})
