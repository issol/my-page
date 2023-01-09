import * as Type from '@glocalize-inc/glo-languages'

//GloLanguageEnum
export const getGloLanguage = () => {
  return Object.entries(Type['GloLanguageEnum'])
    .map(([value, label]) => ({
      value,
      label,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
