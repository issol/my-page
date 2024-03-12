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
    .test('is-http-url', FormErrors.notHTTPPrefixUrl, value => {
      if (!value || value === "") return true // Pass validation if value is empty
      return value.startsWith('https://') || value.startsWith('http://')
    })
    .url(FormErrors.invalidUrl)
    .nullable(),
  timezone: yup.object().shape({
    code: yup.string().nullable(),
    label: yup.string().required(FormErrors.required),
  }),
  isTaxable: yup.boolean().required(FormErrors.required),
  // TODO: isTaxable 결과에 따른 tax 유효성 검사가 잘 되지 않아 tax를 nullable 처리하고 필드에서 별도 유효성 로직을 추가함
  tax: yup
    .number()
    .nullable(),
    // .when('isTaxable', (isTaxable, schema) =>
    //   isTaxable
    //     ? schema.required(FormErrors.required)
    //     : yup.number().nullable().notRequired(),
    // ),
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
