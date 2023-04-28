import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CurrencyType } from '../common/standard-price'
import { ItemType } from '../common/item.type'

export const itemDefaultValue: { items: ItemType[] } = {
  items: [
    {
      name: '',
      source: '',
      target: '',
      priceId: null,
      detail: [],
      totalPrice: 0,
    },
  ],
}

export const itemSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  dueAt: yup.string().nullable(),
  contactPersonId: yup.number().nullable(),
  source: yup.string().required(FormErrors.required),
  target: yup.string().required(FormErrors.required),
  priceId: yup.number().required(FormErrors.required),
  detail: yup.object().shape({
    quantity: yup.number().required(FormErrors.required),
    priceUnit: yup.string().required(FormErrors.required),
    unitPrice: yup.number().nullable(),
    prices: yup.number().required(FormErrors.required),
    unit: yup.string().required(FormErrors.required),
    currency: yup
      .string()
      .oneOf<CurrencyType>(['USD', 'KRW', 'SGD', 'JPY'])
      .required(FormErrors.required),
  }),
  description: yup.string().nullable(),
  analysis: yup.array().of(yup.number().nullable()),
  totalPrice: yup.number().required(FormErrors.required),
})
