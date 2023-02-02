//** TODO : 사용자가 client를 등록할 수 있게 되면 동적으로 값을 생성해야 함 */
export const ClientCategory = [
  { label: 'Naver', value: 'Naver' },
  { label: 'Tapytoon', value: 'Tapytoon' },
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Disney', value: 'Disney' },
  { label: 'Sandbox', value: 'Sandbox' },
  { label: 'RIDI', value: 'RIDI' },
].sort((a, b) => a.label.localeCompare(b.label))

export const ClientCategoryIncludeGloz = [
  { label: 'Naver', value: 'Naver' },
  { label: 'Tapytoon', value: 'Tapytoon' },
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Disney', value: 'Disney' },
  { label: 'Sandbox', value: 'Sandbox' },
  { label: 'RIDI', value: 'RIDI' },
  { label: 'GloZ', value: 'GloZ' },
].sort((a, b) => a.label.localeCompare(b.label))

export const Category = [
  { label: 'No category', value: 'No category' },
  { label: 'Documents/Text', value: 'Documents/Text' },
  { label: 'Dubbing', value: 'Dubbing' },
  { label: 'OTT/Subtitle', value: 'OTT/Subtitle' },
  { label: 'Webnovel', value: 'Webnovel' },
  { label: 'YouTube', value: 'YouTube' },
]

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
