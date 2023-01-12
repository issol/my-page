export const Pronunciation = [
  { value: 'SHE', label: 'she/her/hers' },
  { value: 'HE', label: 'he/him/his' },
  { value: 'THEY', label: 'they/them/their' },
  { value: 'NONE', label: 'Prefer not to answer' },
] as const

export const JobList = [
  { label: 'Documents/Text', value: 'document_text' },
  { label: 'DTP', value: 'dtp' },
  { label: 'Dubbing', value: 'dubbing' },
  { label: 'OTT/Subtitle', value: 'ott_subtitle' },
  { label: 'Webcomics', value: 'webcomics' },
  { label: 'Webnovel', value: 'webnovel' },
  { label: 'YouTube', value: 'youtube' },
]

export const RolePair = {
  document_text: [
    { label: 'QCer', value: 'QCer' },
    { label: 'Translator', value: 'Translator' },
  ],
  dtp: [
    { label: 'DTPer', value: 'DTPer' },
    { label: 'DTP QCer', value: 'DTP QCer' },
  ],
  dubbing: [
    { label: 'Audio description QCer', value: 'Audio description QCer' },
    { label: 'Dubbing QCer', value: 'Dubbing QCer' },
    { label: 'Dubbing script translator', value: 'Dubbing script translator' },
  ],
  ott_subtitle: [
    { label: 'SDH author', value: 'SDH author' },
    { label: 'SDH QCer', value: 'SDH QCer' },
    { label: 'Subtitle author', value: 'Subtitle author' },
    { label: 'Subtitle QCer', value: 'Subtitle QCer' },
    { label: 'Template author', value: 'Template author' },
    { label: 'Template QCer', value: 'Template QCer' },
    { label: 'Supp author', value: 'Supp author' },
    { label: 'Supp QCer', value: 'Supp QCer' },
  ],
  webcomics: [
    { label: 'Proofreader', value: 'Proofreader' },
    { label: 'Webcomics QCer', value: 'Webcomics QCer' },
    { label: 'Webcomic translator', value: 'Webcomic translator' },
  ],
  webnovel: [
    { label: 'Wenovel QCer', value: 'Wenovel QCer' },
    { label: 'Webnovel translator', value: 'Webnovel translator' },
  ],
  youtube: [
    { label: 'Subtitle QCer', value: 'Subtitle QCer' },
    { label: 'Subtitle author', value: 'Subtitle author' },
    { label: 'Translator', value: 'Translator' },
  ],
} as const

export const ExperiencedYears = [
  { value: 'NONE', label: 'No experience' },
  { value: 'LESS_THAN_TWO', label: '1-2 years' },
  { value: 'THREE_TO_FIVE', label: '3-5 years' },
  { value: 'SIX_TO_NINE', label: '6-9 years' },
  { value: 'MORE_THAN_TEN', label: '10+ years' },
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
