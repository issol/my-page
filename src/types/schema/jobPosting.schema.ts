import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type StatusType = 'Ongoing' | 'Paused' | 'Fulfilled' | 'Not started' | ''
export type LinkType = { id?: string; category: string; link: string }
export type JobPostingFormType = {
  status: { label: StatusType; value: StatusType }
  jobType: { label: string; value: string }
  role: { label: string; value: string }
  sourceLanguage: { label: string; value: string }
  targetLanguage: { label: string; value: string }
  link: Array<LinkType>
  yearsOfExperience?: { label: string; value: string }
  numberOfLinguist?: number
  dueDate?: string
  dueDateTimezone?: CountryType
  jobPostLink?: string
}

export const jobPostingFormSchema = yup.object().shape({
  status: yup.object().shape({
    label: yup
      .string()
      .oneOf(['Ongoing', 'Paused', 'Fulfilled', 'Not started', ''])
      .required(FormErrors.required),
    value: yup
      .string()
      .oneOf(['Ongoing', 'Paused', 'Fulfilled', 'Not started', ''])
      .required(FormErrors.required),
  }),
  jobType: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  role: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  sourceLanguage: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  targetLanguage: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
  }),
  link: yup
    .array()
    .min(1, FormErrors.required)
    .max(15)
    .of(
      yup.object().shape({
        category: yup.string().required(FormErrors.required),
        link: yup.string().required(FormErrors.required),
      }),
    )
    .required(),
  yearsOfExperience: yup
    .object()
    .shape({
      label: yup.string().nullable(),
      value: yup.string().nullable(),
    })
    .nullable(),
  numberOfLinguist: yup.number().max(15).nullable(),
  dueDate: yup.string().nullable(),
  dueDateTimezone: yup.object().shape({
    code: yup.string().nullable(),
    label: yup.string().nullable(),
    phone: yup.string().nullable(),
  }),
  jobPostLink: yup.string().nullable(),
})
