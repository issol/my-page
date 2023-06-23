import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { PayableFormType } from '../invoice/payable.type'

export const invoiceDetailInfoDefaultValue: PayableFormType = {}

export function getInvoiceDetailInfoSchema(isAccountManager: boolean) {
  return yup.object().shape({
    status: isAccountManager
      ? yup.string().nullable()
      : yup.string().required(FormErrors.required),
    taxInfo: yup.string().required(FormErrors.required),
    tax: yup
      .number()
      .typeError(FormErrors.required)
      .required(FormErrors.required),
    paymentDueAt: yup.object().shape({
      date: yup.date().nullable(),
      timezone: yup.object().shape({
        code: yup.string().nullable(),
        label: yup.string().nullable(),
        phone: yup.string().nullable(),
      }),
    }),
    paymentDate: yup.object().shape({
      date: yup.date().nullable(),
      timezone: yup.object().shape({
        code: yup.string().nullable(),
        label: yup.string().nullable(),
        phone: yup.string().nullable(),
      }),
    }),
    invoiceDescription: yup.string().nullable(),
  })
}

export const invoiceDetailInfoSchema = yup.object().shape({
  taxInfo: yup.string().required(FormErrors.required),
  tax: yup.number().required(FormErrors.required),
  status: yup.string().required(FormErrors.required),
  paymentDueAt: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
  paymentDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
  invoiceDescription: yup.string().nullable(),
})
