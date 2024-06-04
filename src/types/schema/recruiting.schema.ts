import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'
import { StatusType } from '@src/apis/recruiting.api'

export type RecruitingFormType = {
  status: { label: StatusType; value: StatusType }
  client: { label: string; value: string }
  jobType: { label: string; value: string }
  role: { label: string; value: string }
  sourceLanguage: { label: string; value: string }
  targetLanguage: { label: string; value: string }
  openings?: number
  dueDate?: string
  dueDateTimezone?: { id: number | undefined, label: string; code: string, pinned: boolean }
  jobPostLink?: string
}

export const recruitingFormSchema = yup.object().shape({
  status: yup.object().shape({
    label: yup
      .string()
      .oneOf(['Ongoing', 'Paused', 'Fulfilled', ''])
      .required(FormErrors.required),
    value: yup
      .string()
      .oneOf(['Ongoing', 'Paused', 'Fulfilled', ''])
      .required(FormErrors.required),
  }),
  client: yup.object().shape({
    label: yup.string().required(FormErrors.required),
    value: yup.string().required(FormErrors.required),
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
  openings: yup.number().max(15).nullable(),
  dueDate: yup.string().nullable(),
  //   dueDateTimezone: yup.string().nullable(),
  dueDateTimezone: yup.object().shape({
    id: yup.number().nullable(),
    code: yup.string().nullable(),
    label: yup.string().nullable(),
    pinned: yup.boolean().nullable(),
  }),
  jobPostLink: yup.string().nullable(),
})
