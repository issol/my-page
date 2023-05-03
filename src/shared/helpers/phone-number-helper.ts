export const getPhoneNumber = (phone: string | null, timezonePhone: string) => {
  return phone ? `+${timezonePhone}) ${phone}` : '-'
}
