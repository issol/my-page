import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type PersonType = 'Mr.' | 'Ms.'
export type ClientContactPersonType = {
  contactPersons?: Array<ContactPersonType>
}

export type ContactPersonType = {
  id?: string
  personType?: PersonType
  firstName?: string
  middleName?: string
  lastName?: string
  department?: string
  jobTitle?: string
  timezone: {
    phone: string
    code: string
    label: string
  }
  email: string
  phone?: string
  mobile?: string
  fax?: string
  memo?: string
}

export const contactPersonDefaultValue: ClientContactPersonType = {
  contactPersons: [],
}

export const clientContactPersonSchema = yup.object().shape({
  contactPersons: yup.array().of(
    yup.object().shape({
      personType: yup
        .string()
        .oneOf(['Mr.', 'Ms.'])
        .required(FormErrors.required),
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
      email: yup
        .string()
        .email(FormErrors.invalidEmail)
        .required(FormErrors.required),
      memo: yup.string().nullable(),
    }),
  ),
})
// .nullable()
