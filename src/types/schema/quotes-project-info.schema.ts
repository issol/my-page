import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { OrderStatusType } from '../common/orders.type'
import { QuoteStatusType } from '../common/quotes.type'

export const quotesProjectInfoDefaultValue = {
  status: 'In preparation' as QuoteStatusType,
  projectName: '',
  quoteDate: Date(),
}
export const quotesProjectInfoSchema = yup.object().shape({
  status: yup.string().required(FormErrors.required),
  workName: yup.string().nullable(),
  projectName: yup.string().required(FormErrors.required),
  projectDescription: yup.string().nullable(),
  category: yup.string().nullable(),

  serviceType: yup.array().of(yup.string()).nullable(),
  expertise: yup.array().of(yup.string()).nullable(),
  quoteDate: yup.date().required(FormErrors.required),
  projectDueDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
  quoteDeadline: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
  quoteExpiryDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
  estimatedDeliveryDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
})
