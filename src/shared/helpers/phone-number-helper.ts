export const getPhoneNumber = (
  phone: string | null | undefined,
  timezonePhone: string | undefined,
) => {
  if (phone && timezonePhone) return phone ? `+${timezonePhone}) ${phone}` : '-'
  return !phone && timezonePhone ? '-' : phone
}
