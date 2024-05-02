import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const quotesProjectInfoDefaultValue = {
  projectName: '',
  showDescription: false,
}
export const quotesProjectInfoSchema = yup.object().shape({
  status: yup.number().required(FormErrors.required),
  workName: yup.string().nullable(),
  projectName: yup.string().required(FormErrors.required),
  projectDescription: yup.string().nullable(),
  category: yup.string().required(FormErrors.required),

  // serviceType: yup.array().of(yup.string()).required(FormErrors.required),
  serviceType: yup
    .array()
    .of(yup.string())
    .min(1, FormErrors.required)
    .required(FormErrors.required),
  genre: yup.array().of(yup.string()).nullable(),
  // quoteDate: yup.date().required(FormErrors.required),
  quoteDate: yup.object().shape({
    date: yup.date().required(FormErrors.required),
    timezone: yup.object().shape({
      id: yup.number().nullable(),
      code: yup.string().nullable(),
      label: yup.string().required(),
      pinned: yup.boolean().nullable(),
    }),
  }),
  projectDueDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      id: yup.number().nullable(),
      code: yup.string().nullable(),
      label: yup.string().nullable(),
      pinned: yup.boolean().nullable(),
    }),
  }),
  quoteDeadline: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      id: yup.number().nullable(),
      code: yup.string().nullable(),
      label: yup.string().nullable(),
      pinned: yup.boolean().nullable(),
    }),
  }),
  quoteExpiryDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      id: yup.number().nullable(),
      code: yup.string().nullable(),
      label: yup.string().nullable(),
      pinned: yup.boolean().nullable(),
    }),
  }),
  estimatedDeliveryDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      id: yup.number().nullable(),
      code: yup.string().nullable(),
      label: yup.string().nullable(),
      pinned: yup.boolean().nullable(),
    }),
  }),
  showDescription: yup.boolean().required(),
})
