// TODO : src/shared/const/client/clients.ts 의 ClientList 변경
export const ClientCategory = [
  { label: 'Naver', value: 'Naver' },
  { label: 'Tapytoon', value: 'Tapytoon' },
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Disney', value: 'Disney' },
  { label: 'Sandbox', value: 'Sandbox' },
  { label: 'RIDI', value: 'RIDI' },
].sort((a, b) => a.label.localeCompare(b.label))

// TODO : src/shared/const/client/clients.ts 의 ClientListIncludeGloz 변경
export const ClientCategoryIncludeGloz = [
  { label: 'Naver', value: 'Naver' },
  { label: 'Tapytoon', value: 'Tapytoon' },
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Disney', value: 'Disney' },
  { label: 'Sandbox', value: 'Sandbox' },
  { label: 'RIDI', value: 'RIDI' },
  { label: 'GloZ', value: 'GloZ' },
].sort((a, b) => a.label.localeCompare(b.label))

// TODO : src/shared/const/category/categories.ts 의 CategoryList로 변경
export const Category = [
  { label: 'No category', value: 'No category' },
  { label: 'Documents/Text', value: 'Documents/Text' },
  { label: 'Dubbing', value: 'Dubbing' },
  { label: 'OTT/Subtitle', value: 'OTT/Subtitle' },
  { label: 'Webnovel', value: 'Webnovel' },
  { label: 'YouTube', value: 'YouTube' },
]

// TODO : src/shared/const/service-type/service-types.ts의 ServiceTypeList
export const ServiceType = [
  { label: 'Admin task(Internal task)', value: 'Admin task(Internal task)' },
  { label: 'Copywriting', value: 'Copywriting' },
  { label: 'DTP', value: 'DTP' },
  { label: 'DTP QC', value: 'DTP QC' },
  { label: 'DTP file prep', value: 'DTP file prep' },
  { label: 'Editing', value: 'Editing' },
  { label: 'File preparation', value: 'File preparation' },
  { label: 'Final check', value: 'Final check' },
  { label: 'interpretation', value: 'interpretation' },
  { label: 'Proofreading', value: 'Proofreading' },
  { label: 'QC', value: 'QC' },
  { label: 'Review', value: 'Review' },
  { label: 'Revision(Rework)', value: 'Revision(Rework)' },
  { label: 'Subtitle', value: 'Subtitle' },
  {
    label: 'TAE(Translator accept edits)',
    value: 'TAE(Translator accept edits)',
  },
  { label: 'Transcription', value: 'Transcription' },
  { label: 'Translation', value: 'Naver' },
  { label: 'Translation and DTP', value: 'Translation and DTP' },
  { label: 'Translation Revision', value: 'Translation Revision' },
  { label: 'Video editing', value: 'Video editing' },
].sort((a, b) => a.label.localeCompare(b.label))

// TODO : src/shared/const/service-type/service-types.ts의 ServiceTypePair
export const ServiceType2 = {
  'Documents/Text': [
    { label: 'Copywriting', value: 'Copywriting' },
    { label: 'DTP', value: 'DTP' },
    { label: 'DTP QC', value: 'DTP QC' },
    { label: 'DTP file prep', value: 'DTP file prep' },
    { label: 'Editing', value: 'Editing' },
    { label: 'File preparation', value: 'File preparation' },
    { label: 'Final check', value: 'Final check' },
    { label: 'Proofreading', value: 'Proofreading' },
    { label: 'QC Review', value: 'QC Review' },
    { label: 'Revision(Rework)', value: 'Revision(Rework)' },
    {
      label: 'TAE(Translator accept edits)',
      value: 'TAE(Translator accept edits)',
    },
    { label: 'Transcription', value: 'Transcription' },
    { label: 'Translation', value: 'Translation' },
    { label: 'Translation and DTP', value: 'Translation and DTP' },
    { label: 'Translation Revision', value: 'Translation Revision' },
  ],
  Dubbing: [
    { label: 'Editing', value: 'Editing' },
    { label: 'File preparation', value: 'File preparation' },
    { label: 'Final check', value: 'Final check' },
    { label: 'Proofreading', value: 'Proofreading' },
    { label: 'QC Review', value: 'QC Review' },
    { label: 'Revision(Rework)', value: 'Revision(Rework)' },
    {
      label: 'TAE(Translator accept edits)',
      value: 'TAE(Translator accept edits)',
    },
    { label: 'Transcription', value: 'Transcription' },
    { label: 'Translation', value: 'Translation' },
    { label: 'Translation Revision', value: 'Translation Revision' },
  ],
  'OTT/Subtitle': [
    { label: 'Editing', value: 'Editing' },
    { label: 'File preparation', value: 'File preparation' },
    { label: 'Final check', value: 'Final check' },
    { label: 'Proofreading', value: 'Proofreading' },
    { label: 'QC Review', value: 'QC Review' },
    { label: 'Revision(Rework)', value: 'Revision(Rework)' },
    {
      label: 'TAE(Translator accept edits)',
      value: 'TAE(Translator accept edits)',
    },
    { label: 'Transcription', value: 'Transcription' },
    { label: 'Translation', value: 'Translation' },
    { label: 'Translation Revision', value: 'Translation Revision' },
  ],
}
