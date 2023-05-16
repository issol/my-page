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
  jobStartDate: yup.string().notRequired(),
  jobStartDateTimezone: yup
    .object()
    .shape({
      code: yup.string().required(),
      label: yup.string().required(),
      phone: yup.string().required(),
    })
    .notRequired(),
  jobDueDate: yup.string().required(),
  jobDueDateTimezone: yup.string().required(),
  jobDescription: yup.string().notRequired(),
})
