import { getGloLanguage } from '../transformer/language.transformer'

export default function languageHelper(value: any) {
  if (value === 'others') return 'Others'
  const languageList = getGloLanguage()

  const temp = languageList.find((lang: { value: any }) => lang.value == value)
  return temp?.label
}