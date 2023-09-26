import { FormErrors } from '@src/shared/const/formErrors'
import * as yup from 'yup'

export const addJobInfoFormSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  // status: yup
  //   .object()
  //   .shape({
  //     label: yup.string().required(FormErrors.required),
  //     value: yup.string().required(FormErrors.required),
  //   })
  //   .required(),
  status: yup.number().required(FormErrors.required),
  contactPerson: yup
    .object()
    .shape({
      label: yup.string().required(FormErrors.required),
      value: yup.string().required(FormErrors.required),
      userId: yup.number().required(),
    })
    .required(),
  serviceType: yup.string().required(),
  // .shape({
  //   label: yup.string().required(),
  //   value: yup.string().required(),
  // })
  // .required(),
  source: yup.string().nullable().required(FormErrors.required),
  target: yup.string().nullable().required(FormErrors.required),
  isShowDescription: yup.boolean().required(),
  startedAt: yup.date().nullable(),
  startTimezone: yup.object().shape({
    code: yup.string().nullable(),
    label: yup.string().nullable(),
    phone: yup.string().nullable(),
  }),

  dueAt: yup.date().required(FormErrors.required),
  dueTimezone: yup
    .object()
    .shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    })
    .required(),
  description: yup.string().nullable(),
})

export const addPricesFormSchema = yup.object().shape({})

export const editJobInfoSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  contactPersonId: yup.number().required(FormErrors.required),
})
