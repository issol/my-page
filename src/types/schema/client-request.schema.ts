import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { RequestFormType } from '../requests/common.type'

export function getClientRequestDefaultValue(
  contactPersonId: number,
): RequestFormType {
  return {
    lspId: -0,
    contactPersonId,
    items: [
      {
        name: '',
        sourceLanguage: '',
        targetLanguage: '',
        category: '',
        serviceType: [],
        desiredDueDate: '',
        desiredDueTimezone: {
          phone: '',
          label: '',
          code: '',
        },
      },
    ],
    sampleFiles: [],
  }
}

export const clientRequestSchema = yup.object().shape({
  lspId: yup.number().required(FormErrors.required),
  contactPersonId: yup.number().required(FormErrors.required),
  items: yup.array().of(
    yup.object().shape({
      name: yup.string().required(FormErrors.required),
      sourceLanguage: yup.string().required(FormErrors.required),
      targetLanguage: yup.string().required(FormErrors.required),
      category: yup.string().required(FormErrors.required),
      serviceType: yup.array().of(yup.string()).min(1, FormErrors.required),
      unit: yup.string().nullable(),
      quantity: yup.number().nullable(),
      desiredDueDate: yup.string().required(FormErrors.required),
      desiredDueTimezone: yup.object().shape({
        code: yup.string().nullable(),
        label: yup.string().nullable(),
        phone: yup.string().nullable(),
      }),
    }),
  ),
  sampleFiles: yup
    .array()
    .of(
      yup.object().shape({
        fileName: yup.string().nullable(),
        fileSize: yup.number().nullable(),
      }),
    )
    .nullable(),
  notes: yup.string().nullable(),
})
