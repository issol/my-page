import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

const ceoSchema = yup.object().shape({
  firstName: yup.string().nullable(),
  middleName: yup.string().nullable(),
  lastName: yup.string().nullable(),
})

const addressSchema = yup.object().shape({
  officeName: yup.string().nullable(),
  baseAddress: yup.string().nullable(),
  detailAddress: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  country: yup.object().shape({
    value: yup.string().nullable(),
    label: yup.string().nullable(),
  }),
  zipCode: yup.string().nullable(),
})

export const lpmCompanyInfoSchema = yup.object().shape({
  name: yup.string().required(FormErrors.required),
  ceo: yup.array().of(ceoSchema),
  headquarter: yup.object().shape({
    value: yup.string().nullable(),
    label: yup.string().nullable(),
  }),
  timezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
  registrationNumber: yup.string().nullable(),
  email: yup.string().email().nullable(),
  phone: yup.string().nullable(),
  fax: yup.string().nullable(),
})

export const lpmCompanyAddressSchema = yup.object().shape({
  address: yup.array().of(addressSchema),
})
