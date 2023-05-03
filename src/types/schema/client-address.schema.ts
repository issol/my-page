import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type ClientAddressFormType = {
  clientAddresses?: Array<
    ClientAddressType & {
      id?: string
    }
  >
}

export type ClientAddressType = {
  addressType?: 'billing' | 'shipping' | 'additional'
  name?: string
  baseAddress?: string //street1
  detailAddress?: string //street2
  city?: string
  state?: string
  country?: string
  zipCode?: string
  createdAt?: string
  updatedAt?: string
  isSelected?: boolean
}

export const clientAddressDefaultValue: ClientAddressFormType = {
  clientAddresses: [{ addressType: 'billing' }, { addressType: 'shipping' }],
}

export const clientAddressSchema = yup.object().shape({
  clientAddresses: yup
    .array()
    .of(
      yup.object().shape({
        addressType: yup
          .string()
          .oneOf(['billing', 'shipping', 'additional'])
          .nullable(),
        name: yup
          .string()
          .nullable()
          .when('addressType', (addressType, schema) =>
            addressType === 'additional'
              ? yup.string().required(FormErrors.required)
              : schema,
          ),
        baseAddress: yup.string().nullable(),
        detailAddress: yup.string().nullable(),
        city: yup.string().nullable(),
        state: yup.string().nullable(),
        country: yup.string().nullable(),
        zipCode: yup.string().nullable(),
      }),
    )
    .nullable(),
})
