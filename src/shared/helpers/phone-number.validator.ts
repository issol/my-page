export function isInvalidPhoneNumber(str: string) {
  const regex = /^[0-9]+$/
  return str && !regex.test(str)
}
