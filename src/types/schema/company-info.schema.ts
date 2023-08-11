import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type ClientType = 'Company' | 'Mr' | 'Ms'
export type CompanyInfoFormType = {
  clientType?: ClientType
  status?: string
  name: string
  email: string
  phone?: string
  mobile?: string
  fax?: string
  websiteLink?: string
  timezone: CountryType
  isTaxable?: boolean
  tax?: number | null
  memo?: string
  headquarter?: string
  businessRegistrationNumber?: string
  nameOfRepresentative?: string
  businessCommencementDate?: string
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
  websiteLink: yup.string().url(FormErrors.invalidUrl).nullable(),
  timezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
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
  businessRegistrationNumber: yup.string().nullable(),
  nameOfRepresentative: yup.string().nullable(),
  businessCommencementDate: yup.date().nullable(),
})

export const companyInfoDefaultValue: CompanyInfoFormType = {
  clientType: 'Company',
  status: '',
  name: '',
  email: '',
  timezone: { code: '', label: '', phone: '' },
}
