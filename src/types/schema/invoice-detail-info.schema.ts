import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { PayableFormType } from '../invoice/payable.type'

export const invoiceDetailInfoDefaultValue: PayableFormType = {}

export function getInvoiceDetailInfoSchema(isAccountManager: boolean) {
  return yup.object().shape({
    invoiceStatus: isAccountManager
      ? yup.string().nullable()
      : yup.string().required(FormErrors.required),
    taxInfo: yup
      .string()
      .typeError(FormErrors.required)
      .required(FormErrors.required),
    taxRate: yup.string().when('taxInfo', {
      is: (taxInfo: string) =>
        ['Japan resident', 'US resident', 'Singapore resident'].includes(
          taxInfo,
        ),
      then: yup.string().nullable(),
      otherwise: yup
        .string()
        .typeError(FormErrors.required)
        .required(FormErrors.required),
    }),
    payDueAt: yup.date().nullable(),
    payDueTimezone: yup
      .object()
      .shape({
        code: yup.string().nullable(),
        label: yup.string().nullable(),
      })
      .nullable(),
    paidAt: yup.date().nullable(),
    paidDateTimezone: yup
      .object()
      .shape({
        code: yup.string().nullable(),
        label: yup.string().nullable(),
      })
      .nullable(),

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
      code: yup.string().nullable(),
      label: yup.string().required(FormErrors.required),
    }),
  }),
  paymentDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().nullable(),
      label: yup.string().required(FormErrors.required),
    }),
  }),
  invoiceDescription: yup.string().nullable(),
})
