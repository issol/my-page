import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'
import { StatusType } from '@src/apis/jobPosting.api'

export type LinkType = { id?: string | number; category: string; link: string }
export type JobPostingFormType = {
  status: { label: StatusType; value: StatusType }
  jobType: { label: string; value: string }
  role: { label: string; value: string }
  sourceLanguage: { label: string; value: string }
  targetLanguage: { label: string; value: string }
  postLink: Array<LinkType>
  yearsOfExperience?: { label: string; value: string }
  openings?: number
  dueDate?: string
  dueDateTimezone?: { id: number | undefined, label: string; code: string, pinned: boolean }
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
  postLink: yup
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
  openings: yup.number().max(15).nullable(),
  dueDate: yup.string().nullable(),
  dueDateTimezone: yup.object().shape({
    id: yup.number().nullable(),
    code: yup.string().nullable(),
    label: yup.string().nullable(),
    pinned: yup.boolean().nullable(),
  }),
})
