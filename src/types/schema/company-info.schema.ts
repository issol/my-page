import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '../sign/personalInfoTypes'

export type CompanyInfoFormType = {
  clientType: 'Company' | 'Mr' | 'Ms.'
  name: string
  email: string
  phone?: string
  mobile?: string
  fax?: string
  websiteLink?: string
  timezone: CountryType
  memo?: string
}
export const companyInfoSchema = yup.object().shape({
  clientType: yup
    .string()
    .oneOf(['Company', 'Mr', 'Ms.'])
    .required(FormErrors.required),
  name: yup.string().required(FormErrors.required),
  email: yup.string().email(FormErrors.invalidEmail),
  phone: yup.string().nullable(),
  mobile: yup.string().nullable(),
  fax: yup.string().nullable(),
  websiteLink: yup.string().url(FormErrors.invalidUrl).nullable(),
  timezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
  memo: yup.string().nullable(),
})

export const companyInfoDefaultValue: CompanyInfoFormType = {
  clientType: 'Company',
  name: '',
  email: '',
  timezone: { code: '', label: '', phone: '' },
}
