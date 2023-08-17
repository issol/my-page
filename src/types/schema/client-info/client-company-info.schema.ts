import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  ClientClassificationType,
  ClientCompanyInfoType,
} from '@src/context/types'

export const clientCompanyInfoSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  headquarter: yup.string().nullable(),
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
      if (!value) return true;  // Pass validation if value is empty
      return value.startsWith('http://') || value.startsWith('https://');
    })
    .url(FormErrors.invalidUrl)
    .nullable(),
  timezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
})

export const getClientCompanyInfoDefaultValue = (
  businessClassification: ClientClassificationType,
): ClientCompanyInfoType => {
  return {
    businessClassification: businessClassification,
    name: '',
    email: '',
    phone: '',
    mobile: '',
    fax: '',
    websiteLink: '',
    timezone: { code: '', label: '', phone: '' },
  }
}
