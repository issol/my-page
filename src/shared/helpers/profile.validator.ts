export function checkNickname(nickname: string): boolean {
  const engCheck = /^[a-zA-Z0-9]+$/
  if (nickname === undefined) return false
  if (
    nickname === null ||
    nickname === '' ||
    nickname?.length < 4 ||
    nickname?.length > 20
  ) {
    return false
  } else if (engCheck.test(nickname)) {
    return true
  } else {
    return false
  }
}

export function checkName(name: string): boolean {
  /* 한글,영문,hyphen(-), 문자열 사이 공백 하나 허용 */
  const regex = /^[가-힣a-zA-Z\s-]{1,50}$/
  if (name === undefined) return false
  if (name === '') return true
  if (name === null || name?.length > 50) {
    return false
  } else if (regex.test(name)) {
    return true
  }
  return false
}
