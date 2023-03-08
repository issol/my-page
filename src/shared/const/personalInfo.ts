// TODO : src/shared/const/pronunciation.ts의 Pronunciation
export const Pronunciation = [
  { value: 'SHE', label: 'she/her/hers' },
  { value: 'HE', label: 'he/him/his' },
  { value: 'THEY', label: 'they/them/their' },
  { value: 'NONE', label: 'Prefer not to answer' },
] as const

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

// TODO : src/shared/const/role/roles.ts의 RoleList
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

// TODO : src/shared/const/experienced-years.ts의 ExperiencedYears
export const ExperiencedYears = [
  { value: 'No experience', label: 'No experience' },
  { value: '1-2 year(s)', label: '1-2 year(s)' },
  { value: '3-5 years', label: '3-5 years' },
  { value: '6-9 years', label: '6-9 years' },
  { value: '10+ years', label: '10+ years' },
] as const

// TODO : src/shared/const/area-of-expertise/area-of-expertise.ts 의 AreaOfExpertiseList
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

// TODO : src/shared/const/status/statuses.ts 의 TestStatus
export const TestStatus = [
  {
    label: 'Awaiting assignment',
    value: 'Awaiting assignment',
  },
  { label: 'Test assigned', value: 'Test assigned' },
  {
    label: 'Basic in progress',
    value: 'Basic in progress',
  },
  {
    label: 'Basic submitted',
    value: 'Basic submitted',
  },
  {
    label: 'Basic failed',
    value: 'Basic failed',
  },
  {
    label: 'Basic passed',
    value: 'Basic passed',
  },
  {
    label: 'Skill in progress',
    value: 'Skill in progress',
  },
  {
    label: 'Skill submitted',
    value: 'Skill submitted',
  },
  {
    label: 'Reviewing',
    value: 'Reviewing',
  },
  {
    label: 'Review canceled',
    value: 'Review canceled',
  },

  {
    label: 'Review completed',
    value: 'Review completed',
  },
  {
    label: 'Skill failed',
    value: 'Skill failed',
  },
  {
    label: 'Paused',
    value: 'Paused',
  },
  {
    label: 'Rejected',
    value: 'Rejected',
  },
]
