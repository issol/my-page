import { getGloLanguage } from '../transformer/language.transformer'

export default function languageHelper(value: any) {
  if (value === 'others') return 'Others'
  const languageList = getGloLanguage()

  const temp = languageList.find((lang: { value: any }) => lang.value == value)
  return temp?.label
}

export const convertLanguageCodeToPair = (source?: string, target?: string) => {
  if (source && target) {
    return `${languageHelper(source)} -> ${languageHelper(target)}`
  }
  return '-'
}

export const convertMultipleTargetLanguageCodeToPair = (
  source?: string,
  target?: string[],
) => {
  if (source && target) {
    const targetLanguages = target
      .map(language => languageHelper(language))
      .join(', ')
    return `${languageHelper(source)} -> ${targetLanguages}`
  }
  return '-'
}
