import * as yup from 'yup'

export const addJobInfoFormSchema = yup.object().shape({
  jobName: yup.string().required(),
  status: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required(),
  contactPerson: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required(),
  serviceType: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required(),
  languagePair: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required(),
  showPro: yup.boolean().required(),
  jobStartDate: yup.date().nullable(),
  jobStartDateTimezone: yup.object().shape({
    code: yup.string().nullable(),
    label: yup.string().nullable(),
    phone: yup.string().nullable(),
  }),

  jobDueDate: yup.date().required(),
  jobDueDateTimezone: yup
    .object()
    .shape({
      code: yup.string().required(),
      label: yup.string().required(),
      phone: yup.string().required(),
    })
    .required(),
  jobDescription: yup.string(),
})

export const addPricesFormSchema = yup.object().shape({})
