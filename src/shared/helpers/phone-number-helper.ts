export const getPhoneNumber = (
  phone: string | null | undefined,
  timezonePhone: string | undefined,
) => {
  if (phone && timezonePhone) return phone ? `+${timezonePhone}) ${phone}` : '-'
  return !phone && timezonePhone ? '-' : phone
}

export const splitContryCodeAndPhoneNumber = (
  phoneNumber: string
) => {
  return {
    countryCode: phoneNumber.split('|')[0],
    number: phoneNumber.split('|')[1]
  }
}

export const contryCodeAndPhoneNumberFormatter = (
  data: {
    countryCode: string | null,
    number: string
  }
) => {
  if (!data.countryCode) return `${data.number}`
  return `+${data.countryCode}) ${data.number}`
}