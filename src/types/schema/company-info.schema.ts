import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type ClientType = 'Company' | 'Mr' | 'Ms'
export type CompanyInfoFormType = {
  clientType?: ClientType
  status?: string
  name?: string
  email?: string
  phone?: string
  mobile?: string
  fax?: string
  websiteLink?: string
  timezone?: CountryType | null
  isTaxable?: boolean
  tax?: number | null
  memo?: string
  headquarter?: string
  registrationNumber?: number
  representativeName?: string
  commencementDate?: string
}
export const companyInfoSchema = yup.object().shape({
  clientType: yup
    .string()
    .oneOf(['Company', 'Mr', 'Ms'])
    .required(FormErrors.required),
  status: yup.string().required(FormErrors.required),
  name: yup.string().required(FormErrors.required),
  email: yup
    .string()
    .email(FormErrors.invalidEmail)
    .required(FormErrors.required),
  phone: yup.string().nullable(),
  mobile: yup.string().nullable(),
  fax: yup.string().nullable(),
  // websiteLink: yup.string().url(FormErrors.invalidUrl).nullable(),
  websiteLink: yup
    .string()
    .matches(
      /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
      FormErrors.invalidUrl,
    )
    .test('is-http-url', FormErrors.notHTTPPrefixUrl, value => {
      if (!value) return true // Pass validation if value is empty
      return value.startsWith('https://') || value.startsWith('http://')
    }),
  timezone: yup.object().shape({
    code: yup.string().nullable(),
    label: yup.string().required(FormErrors.required),
  }),
  isTaxable: yup.boolean().required(FormErrors.required),
  tax: yup
    .number()
    .required(FormErrors.required)
    .when('isTaxable', (isTaxable, schema) =>
      !isTaxable ? yup.number().nullable() : schema,
    ),
  memo: yup.string().nullable(),
  headquarter: yup.string().nullable(),
  registrationNumber: yup.string().nullable(),
  representativeName: yup.string().nullable(),
  commencementDate: yup.date().nullable(),
})

export const companyInfoDefaultValue: CompanyInfoFormType = {
  clientType: 'Company',
  status: 'New',
  name: '',
  email: '',
}
