export const Pronunciation = [
  { value: 'SHE', label: 'she/her/hers' },
  { value: 'HE', label: 'he/him/his' },
  { value: 'THEY', label: 'they/them/their' },
  { value: 'NONE', label: 'Prefer not to answer' },
] as const

export const JobList = [
  { label: 'Documents/Text', value: 'Documents/Text' },
  { label: 'DTP', value: 'DTP' },
  { label: 'Dubbing', value: 'Dubbing' },
  { label: 'Interpretation', value: 'Interpretation' },
  { label: 'Misc.', value: 'Misc.' },
  { label: 'OTT/Subtitle', value: 'OTT/Subtitle' },
  { label: 'Webcomics', value: 'Webcomics' },
  { label: 'Webnovel', value: 'Webnovel' },
  { label: 'YouTube', value: 'YouTube' },
].sort((a, b) => a.label.localeCompare(b.label))

export const RolePair = {
  'Documents/Text': [
    { label: 'QCer', value: 'QCer' },
    { label: 'Translator', value: 'Translator' },
  ],
  DTP: [
    { label: 'DTPer', value: 'DTPer' },
    { label: 'DTP QCer', value: 'DTP QCer' },
  ],
  Interpretation: [{ label: 'Interpretation', value: 'Interpretation' }],
  'Misc.': [
    { label: 'Copywriter', value: 'Copywriter' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Video editor', value: 'Video editor' },
  ],
  Dubbing: [
    { label: 'Audio description QCer', value: 'Audio description QCer' },
    { label: 'Dubbing QCer', value: 'Dubbing QCer' },
    { label: 'Dubbing script translator', value: 'Dubbing script translator' },
  ],
  'OTT/Subtitle': [
    { label: 'SDH author', value: 'SDH author' },
    { label: 'SDH QCer', value: 'SDH QCer' },
    { label: 'Subtitle author', value: 'Subtitle author' },
    { label: 'Subtitle QCer', value: 'Subtitle QCer' },
    { label: 'Template author', value: 'Template author' },
    { label: 'Template QCer', value: 'Template QCer' },
    { label: 'Supp author', value: 'Supp author' },
    { label: 'Supp QCer', value: 'Supp QCer' },
  ],
  Webcomics: [
    { label: 'Proofreader', value: 'Proofreader' },
    { label: 'Webcomics QCer', value: 'Webcomics QCer' },
    { label: 'Webcomic translator', value: 'Webcomic translator' },
  ],
  Webnovel: [
    { label: 'Wenovel QCer', value: 'Wenovel QCer' },
    { label: 'Webnovel translator', value: 'Webnovel translator' },
  ],
  YouTube: [
    { label: 'Subtitle QCer', value: 'Subtitle QCer' },
    { label: 'Subtitle author', value: 'Subtitle author' },
    { label: 'Translator', value: 'Translator' },
  ],
} as const

export const ExperiencedYears = [
  { value: 'No experience', label: 'No experience' },
  { value: '1-2 years', label: '1-2 years' },
  { value: '3-5 years', label: '3-5 years' },
  { value: '6-9 years', label: '6-9 years' },
  { value: '10+ years', label: '10+ years' },
] as const

export const Specialties = [
  { label: 'Cooking/Food&Drink', value: 'Cooking/Food&Drink' },
  {
    label: 'Health(Mental and physical)',
    value: 'Health(Mental and physical)',
  },
  { label: 'Sports', value: 'Sports' },
  { label: 'Beauty/Fashion', value: 'Beauty/Fashion' },
  { label: 'Movies', value: 'Movies' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Documents', value: 'Documents' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Education/Teaching', value: 'Education/Teaching' },
  { label: 'Music/Entertainment', value: 'Music/Entertainment' },
  { label: 'Animals/Pets', value: 'Animals/Pets' },
  { label: 'Nature', value: 'Nature' },
  { label: 'Travel', value: 'Travel' },
  {
    label: 'Vehicles(Planes, Trains and Automobiles)',
    value: 'Vehicles(Planes, Trains and Automobiles)',
  },
  { label: 'Science/Engineering', value: 'Science/Engineering' },
  { label: 'Computers/Tech', value: 'Computers/Tech' },
  { label: 'Legal', value: 'Legal' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Political', value: 'Political' },
  { label: 'Police/Military', value: 'Police/Military' },
  { label: 'Non-profit/Activism', value: 'Non-profit/Activism' },
  { label: 'Gaming', value: 'Gaming' },
  { label: 'Webcomics', value: 'Webcomics' },
  { label: 'Webnovel/Books/E-books', value: 'Webnovel/Books/E-books' },
  { label: 'Subtitling', value: 'Subtitling' },
  { label: 'Interpreting', value: 'Interpreting' },
  { label: 'Dubbing script translating', value: 'Dubbing script translating' },
  { label: 'YouTube', value: 'YouTube' },
  { label: 'Transcription', value: 'Transcription' },
  { label: 'Proofreading', value: 'Proofreading' },
]
