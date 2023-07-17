import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type ClientAddressFormType = {
  clientAddresses?: Array<
    ClientAddressType & {
      id?: string
    }
  >
}

export type AddressType = 'billing' | 'shipping' | 'additional'

//** 서버에서 받아오는 데이터는 T=number, form에서는 T=string으로 사용하기 */
export type ClientAddressType<T extends string | number = string> = {
  id?: T
  addressType?: AddressType
  name?: string | null
  baseAddress?: string | null //street1
  detailAddress?: string | null //street2
  city?: string | null
  state?: string | null
  country?: string | null
  zipCode?: string | null
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
