import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { RequestFormType } from '../requests/common.type'
import { CountryType } from '../sign/personalInfoTypes'

export function getClientRequestDefaultValue(
  contactPersonId: number,
  timezone: CountryType,
): RequestFormType {
  return {
    lspId: '',
    contactPersonId: contactPersonId,
    userId: null,
    items: [
      {
        name: '',
        sourceLanguage: '',
        targetLanguage: '',
        category: '',
        serviceType: [],
        desiredDueDate: null,
        desiredDueTimezone: timezone,
      },
    ],
    sampleFiles: [],
  }
}

export const clientRequestSchema = yup.object().shape({
  lspId: yup.string().required(FormErrors.required),
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
        code: yup.string().required(FormErrors.required),
        label: yup.string().required(FormErrors.required),
        phone: yup.string().required(FormErrors.required),
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
