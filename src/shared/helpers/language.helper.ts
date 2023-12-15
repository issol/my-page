import { getGloLanguage } from '../transformer/language.transformer'

export default function languageHelper(value: any) {
  if (value === 'others') return 'Others'
  const languageList = getGloLanguage()

  console.log(languageList)

  const temp = languageList.find((lang: { value: any }) => lang.value == value)
  return temp?.label
}

export const convertLanguageCodeToPair = (source?: string, target?: string) => {
  if (source && target) {
    return `${languageHelper(source)} -> ${languageHelper(target)}`
  }
  return '-'
}
