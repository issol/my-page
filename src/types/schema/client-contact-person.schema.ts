import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type ClientContactPersonType = Array<{
  firstName: string
  middleName?: string
  lastName: string
  department?: string
  jobTitle?: string
  timezone: {
    phone: string
    code: string
    label: string
  }
  phone?: string
  mobile?: string
  fax?: string
  email: string
  memo?: string
}>

export const clientContactPersonSchema = yup.object().shape({
  firstName: yup.string().required(FormErrors.required),
  middleName: yup.string().nullable(),
  lastName: yup.string().required(FormErrors.required),
  department: yup.string().nullable(),
  jobTitle: yup.string().nullable(),
  timezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
  phone: yup.string().nullable(),
  mobile: yup.string().nullable(),
  fax: yup.string().nullable(),
  email: yup.string().email(FormErrors.invalidEmail).nullable(),
  memo: yup.string().nullable(),
})
