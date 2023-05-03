import { ClientAddressType } from '@src/types/schema/client-address.schema'

export const getAddress = (address: ClientAddressType[]) => {
  const addressType = address.find(item => item.isSelected)
  console.log(addressType)

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
