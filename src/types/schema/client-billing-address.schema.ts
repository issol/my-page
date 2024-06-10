import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { ClientAddressType } from './client-address.schema'

export const clientBillingAddressDefaultValue: ClientAddressType = {
  baseAddress: '',
  detailAddress: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
}

export const clientBillingAddressSchema = yup.object().shape({
  addressType: yup
    .string()
    .oneOf(['billing', 'shipping', 'additional'])
    .nullable(),
  baseAddress: yup.string().required(FormErrors.required),
  detailAddress: yup.string().nullable(),
  city: yup.string().required(FormErrors.required),
  state: yup.string().nullable(),
  country: yup.string().required(FormErrors.required),
  zipCode: yup.string().required(FormErrors.required)
    .test('is-valid-zip', FormErrors.invalidZipCode, value => {
      // 유효하지 않은 특수 문자 패턴
      const invalidChars = /[(){}[\]~\\;:"'!?&#*+=…`^_|\/]/g;
      return !invalidChars.test(value);
    }),
})
