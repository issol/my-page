import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type PersonType = 'Mr.' | 'Ms.'
export type ClientContactPersonType<T extends number | string = number> = {
  contactPersons?: Array<ContactPersonType<T>>
}

export type ContactPersonType<T extends number | string = number> = {
  id?: T
  personType?: PersonType
  firstName?: string
  middleName?: string | null
  lastName?: string
  department?: string | null
  jobTitle?: string
  timezone: CountryType | null
  email?: string
  phone?: string | null
  mobile?: string | null
  fax?: string | null
  memo?: string
  isReferred?: boolean
  userId: number | null
}

export const contactPersonDefaultValue: ClientContactPersonType = {
  contactPersons: [],
}

// ** TAD가 직접 contact person을 등록하는 경우에 사용되는 schema
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

export const clientContactPersonDefaultValue = {
  firstName: '',
  middleName: '',
  lastName: '',
  department: '',
  jobTitle: '',
  phone: '',
  mobile: '',
  fax: '',
}

// ** CLIENT role로 가입한 유저일 경우에 사용되는 schema
export const createContactPersonSchema = yup.object().shape({
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
})
