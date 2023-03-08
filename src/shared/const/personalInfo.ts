// TODO : src/shared/const/job/jobs.ts의 JobList
export const JobList = [
  { label: 'Documents/Text', value: 'Documents/Text' },
  { label: 'Dubbing', value: 'Dubbing' },
  { label: 'Interpretation', value: 'Interpretation' },
  { label: 'Misc.', value: 'Misc.' },
  { label: 'OTT/Subtitle', value: 'OTT/Subtitle' },
  { label: 'Webcomics', value: 'Webcomics' },
  { label: 'Webnovel', value: 'Webnovel' },
].sort((a, b) => a.label.localeCompare(b.label))

// TODO : src/shared/const/role/roles.ts의 ProRolePair
export const RolePair = {
  'Documents/Text': [
    { label: 'QCer', value: 'QCer' },
    { label: 'Translator', value: 'Translator' },
    { label: 'Transcriber', value: 'Transcriber' },
    { label: 'DTPer', value: 'DTPer' },
    { label: 'DTP QCer', value: 'DTP QCer' },
  ],
  Dubbing: [
    { label: 'Audio describer', value: 'Audio describer' },
    { label: 'Audio description QCer', value: 'Audio description QCer' },
    { label: 'Dubbing audio QCer', value: 'Dubbing audio QCer' },
    { label: 'Dubbing script QCer', value: 'Dubbing script QCer' },
    { label: 'Dubbing script translator', value: 'Dubbing script translator' },
    { label: 'Dubbing voice artist', value: 'Dubbing voice artist' },
  ],
  Interpretation: [{ label: 'Interpreter', value: 'Interpreter' }],
  'Misc.': [
    { label: 'Copywriter', value: 'Copywriter' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Video editor', value: 'Video editor' },
  ],

  'OTT/Subtitle': [
    { label: 'QCer', value: 'QCer' },
    { label: 'SDH author', value: 'SDH author' },
    { label: 'SDH QCer', value: 'SDH QCer' },
    { label: 'Subtitle author', value: 'Subtitle author' },
    { label: 'Subtitle QCer', value: 'Subtitle QCer' },
    { label: 'Supp author', value: 'Supp author' },
    { label: 'Supp QCer', value: 'Supp QCer' },
    { label: 'Template author', value: 'Template author' },
    { label: 'Template QCer', value: 'Template QCer' },
    { label: 'Transcriber', value: 'Transcriber' },
    { label: 'Translator', value: 'Translator' },
  ],
  Webcomics: [
    { label: 'DTPer', value: 'DTPer' },
    { label: 'DTP QCer', value: 'DTP QCer' },
    { label: 'Proofreader', value: 'Proofreader' },
    { label: 'Webcomics QCer', value: 'Webcomics QCer' },
    { label: 'Webcomic translator', value: 'Webcomic translator' },
  ],
  Webnovel: [
    { label: 'DTPer', value: 'DTPer' },
    { label: 'DTP QCer', value: 'DTP QCer' },
    { label: 'Wenovel QCer', value: 'Wenovel QCer' },
    { label: 'Webnovel translator', value: 'Webnovel translator' },
  ],
} as const
