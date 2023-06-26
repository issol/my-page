import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { RequestFormType } from '../requests/common.type'

export const clientRequestDefaultValue: RequestFormType = {
  lspId: -0,
  contactPersonId: -0,
  items: [],
  sampleFiles: [],
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
      serviceType: yup.array().of(yup.string()),
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
  sampleFiles: yup.array().nullable(),
})
