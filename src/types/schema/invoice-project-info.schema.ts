import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const invoiceProjectInfoDefaultValue = {
  showDescription: false,
  invoiceDate: new Date(),
}

export const invoiceProjectInfoSchema = yup.object().shape({
  invoiceDate: yup.date().required(FormErrors.required),
  workName: yup.string().nullable(),
  projectName: yup.string().required(FormErrors.required),
  showDescription: yup.boolean().required(FormErrors.required),

  category: yup.string().nullable(),

  serviceType: yup.array().of(yup.string()).nullable(),
  genre: yup.array().of(yup.string()).nullable(),

  revenueFrom: yup
    .string()
    .oneOf(['United States', 'Korea', 'Singapore', 'Japan'])
    .required(FormErrors.required),
  isTaxable: yup.string().required(),

  paymentDueDate: yup.object().shape({
    date: yup.date().required(FormErrors.required),
    timezone: yup.object().shape({
      code: yup.string().nullable(),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().nullable(),
    }),
  }),

  invoiceConfirmDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().nullable(),
      label: yup.string().nullable(),
      phone: yup.string().nullable(),
    }),
  }),

  taxInvoiceDueDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().nullable(),
      label: yup.string().nullable(),
      phone: yup.string().nullable(),
    }),
  }),

  invoiceDescription: yup.string().nullable(),
  setReminder: yup.boolean().required(FormErrors.required),
})
