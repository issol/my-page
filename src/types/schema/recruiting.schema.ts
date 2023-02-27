import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type StatusType = 'Ongoing' | 'Paused' | 'Fulfilled' | ''
export type RecruitingFormType = {
  status: { label: StatusType; value: StatusType }
  client: { label: string; value: string }
  jobType: { label: string; value: string }
  role: { label: string; value: string }
  sourceLanguage: { label: string; value: string }
  targetLanguage: { label: string; value: string }
  numberOfLinguist?: number
  dueDate?: string
  dueDateTimezone?: CountryType
  //   dueDateTimezone?: string
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
  numberOfLinguist: yup.number().max(15).nullable(),
  dueDate: yup.string().nullable(),
  //   dueDateTimezone: yup.string().nullable(),
  dueDateTimezone: yup.object().shape({
    code: yup.string().nullable(),
    label: yup.string().nullable(),
    phone: yup.string().nullable(),
  }),
  jobPostLink: yup.string().nullable(),
})
