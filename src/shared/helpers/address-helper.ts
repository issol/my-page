import { ClientAddressType } from '@src/types/schema/client-address.schema'

export const getAddress = (address: ClientAddressType<string | number>[]) => {
  if (!address || !address.length) return '-'
  const addressType = address.find(item => item.isSelected)
  if (addressType) {
    const state1 = addressType.baseAddress ? `${addressType.baseAddress}, ` : ''

    const state2 = addressType.detailAddress
      ? `${addressType.detailAddress}, `
      : ''

    const city = addressType.city ? `${addressType.city}, ` : ''
    const state = addressType.state ? `${addressType.state}, ` : ''
    const country = addressType.country ? `${addressType.country}, ` : ''
    const zipCode = addressType.zipCode ? `${addressType.zipCode}` : ''

    if (
      state1 === '' &&
      state2 === '' &&
      city === '' &&
      state === '' &&
      country === '' &&
      zipCode === ''
    )
      return '-'

    return `${state1}${state2}${city}${state}${country}${zipCode}`
  }
}

export const getAddressType = (address: ClientAddressType<string | number>[]) => {
  if (!address || !address.length) return '-'
  const addressArray = address.find(item => item.isSelected)
  const addressType = addressArray?.addressType ? addressArray.addressType : ''
  return `${addressType}`
}
