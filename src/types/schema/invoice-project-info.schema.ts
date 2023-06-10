import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { InvoiceReceivableStatusType } from '../invoice/common.type'

export const invoiceProjectInfoDefaultValue = {
  status: 'In preparation' as InvoiceReceivableStatusType,

  invoiceDate: Date(),
}

export const invoiceProjectInfoSchema = yup.object().shape({
  invoiceDate: yup.date().required(FormErrors.required),
  status: yup.string().required(FormErrors.required),
  workName: yup.string().nullable(),
  projectName: yup.string().required(FormErrors.required),

  category: yup.string().nullable(),

  serviceType: yup.array().of(yup.string()).nullable(),
  expertise: yup.array().of(yup.string()).nullable(),

  revenueFrom: yup
    .string()
    .oneOf(['United States', 'Korea', 'Singapore', 'Japan'])
    .required(FormErrors.required),
  taxable: yup.string().required(),

  paymentDueDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
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
  sendReminder: yup.boolean().required(FormErrors.required),
})