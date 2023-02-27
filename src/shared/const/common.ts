export enum Job {
  'Documents/Text' = 'Documents/Text',
  'Dubbing' = 'Dubbing',
  'Misc.' = 'Misc.',
  'Interpretation' = 'Interpretation',
  'OTT/Subtitle' = 'OTT/Subtitle',
  'Webcomics' = 'Webcomics',
  'Webnovel' = 'Webnovel',
}

export enum Role {
  'Audio describer' = 'Audio describer',
  'Audio description QCer' = 'Audio description QCer',
  'Copywriter' = 'Copywriter',
  'DTPer' = 'DTPer',
  'DTP QCer' = 'DTP QCer',
  'Dubbing audio QCer' = 'Dubbing audio QCer',
  'Dubbing script QCer' = 'Dubbing script QCer',
  'Dubbing script translator' = 'Dubbing script translator',
  'Dubbing voice artist' = 'Dubbing voice artist',
  'Editor' = 'Editor',
  'Interpreter' = 'Interpreter',
  'Proofreader' = 'Proofreader',
  'QCer' = 'QCer',
  'SDH author' = 'SDH author',
  'SDH QCer' = 'SDH QCer',
  'Subtitle author' = 'Subtitle author',
  'Subtitle QCer' = 'Subtitle QCer',
  'Supp author' = 'Supp author',
  'Supp QCer' = 'Supp QCer',
  'Template author' = 'Template author',
  'Template QCer' = 'Template QCer',
  'Transcriber' = 'Transcriber',
  'Translator' = 'Translator',
  'Video editor' = 'Video editor',
  'Webcomics QCer' = 'Webcomics QCer',
  'Webcomics translator' = 'Webcomics translator',
  'Webnovel QCer' = 'Webnovel QCer',
  'Webnovel translator' = 'Webnovel translator',
}

export const JobList = [
  { label: Job['Documents/Text'], value: Job['Documents/Text'] },
  { label: Job.Dubbing, value: Job.Dubbing },
  { label: Job.Interpretation, value: Job.Interpretation },
  { label: Job['Misc.'], value: Job['Misc.'] },
  { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  { label: Job.Webcomics, value: Job.Webcomics },
  { label: Job.Webnovel, value: Job.Webnovel },
].sort((a, b) => a.label.localeCompare(b.label))

export const RoleList = [
  { label: Role['Audio describer'], value: Role['Audio describer'] },
  {
    label: Role['Audio description QCer'],
    value: Role['Audio description QCer'],
  },
  { label: Role.Copywriter, value: Role.Copywriter },
  { label: Role.DTPer, value: Role.DTPer },
  { label: Role['DTP QCer'], value: Role['DTP QCer'] },
  { label: Role['Dubbing audio QCer'], value: Role['Dubbing audio QCer'] },
  { label: Role['Dubbing script QCer'], value: Role['Dubbing script QCer'] },
  {
    label: Role['Dubbing script translator'],
    value: Role['Dubbing script translator'],
  },
  { label: Role['Dubbing voice artist'], value: Role['Dubbing voice artist'] },
  { label: Role.Editor, value: Role.Editor },
  { label: Role.Interpreter, value: Role.Interpreter },
  { label: Role.Proofreader, value: Role.Proofreader },
  { label: Role.QCer, value: Role.QCer },
  { label: Role['SDH author'], value: Role['SDH author'] },
  { label: Role['SDH QCer'], value: Role['SDH QCer'] },
  { label: Role['Subtitle author'], value: Role['Subtitle author'] },
  { label: Role['Subtitle QCer'], value: Role['Subtitle QCer'] },
  { label: Role['Supp author'], value: Role['Supp author'] },
  { label: Role['Supp QCer'], value: Role['Supp QCer'] },
  { label: Role['Template author'], value: Role['Template author'] },
  { label: Role['Template QCer'], value: Role['Template QCer'] },
  { label: Role.Transcriber, value: Role.Transcriber },
  { label: Role.Translator, value: Role.Translator },
  { label: Role['Video editor'], value: Role['Video editor'] },
  { label: Role['Webcomics QCer'], value: Role['Webcomics QCer'] },
  { label: Role['Webcomics translator'], value: Role['Webcomics translator'] },
  { label: Role['Webnovel QCer'], value: Role['Webnovel QCer'] },
  { label: Role['Webnovel translator'], value: Role['Webnovel translator'] },
]

export const ProRolePair = {
  'Documents/Text': [
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['DTP QCer'], value: Role['DTP QCer'] },
    { label: Role.QCer, value: Role.QCer },
    { label: Role.Transcriber, value: Role.Transcriber },
    { label: Role.Translator, value: Role.Translator },
  ],
  Dubbing: [
    { label: Role['Audio describer'], value: Role['Audio describer'] },
    {
      label: Role['Audio description QCer'],
      value: Role['Audio description QCer'],
    },
    { label: Role['Dubbing audio QCer'], value: Role['Dubbing audio QCer'] },
    { label: Role['Dubbing script QCer'], value: Role['Dubbing script QCer'] },
    {
      label: Role['Dubbing script translator'],
      value: Role['Dubbing script translator'],
    },
    {
      label: Role['Dubbing voice artist'],
      value: Role['Dubbing voice artist'],
    },
  ],
  Interpretation: [{ label: Role.Interpreter, value: Role.Interpreter }],
  'Misc.': [
    { label: Role.Copywriter, value: Role.Copywriter },
    { label: Role.Editor, value: Role.Editor },
    { label: Role['Video editor'], value: Role['Video editor'] },
  ],

  'OTT/Subtitle': [
    { label: Role.QCer, value: Role.QCer },
    { label: Role['SDH author'], value: Role['SDH author'] },
    { label: Role['SDH QCer'], value: Role['SDH QCer'] },
    { label: Role['Subtitle author'], value: Role['Subtitle author'] },
    { label: Role['Subtitle QCer'], value: Role['Subtitle QCer'] },
    { label: Role['Supp author'], value: Role['Supp author'] },
    { label: Role['Supp QCer'], value: Role['Supp QCer'] },
    { label: Role['Template author'], value: Role['Template author'] },
    { label: Role['Template QCer'], value: Role['Template QCer'] },
    { label: Role.Transcriber, value: Role.Transcriber },
    { label: Role.Translator, value: Role.Translator },
  ],
  Webcomics: [
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['DTP QCer'], value: Role['DTP QCer'] },
    { label: Role.Proofreader, value: Role.Proofreader },
    { label: Role['Webcomics QCer'], value: Role['Webcomics QCer'] },
    {
      label: Role['Webcomics translator'],
      value: Role['Webcomics translator'],
    },
  ],
  Webnovel: [
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['DTP QCer'], value: Role['DTP QCer'] },
    { label: Role['Webnovel QCer'], value: Role['Webnovel QCer'] },
    {
      label: Role['Webcomics translator'],
      value: Role['Webcomics translator'],
    },
  ],
} as const

export const ProJobPair = {
  'Audio describer': [{ label: Job.Dubbing, value: Job.Dubbing }],
  'Audio description QCer': [{ label: Job.Dubbing, value: Job.Dubbing }],
  Copywriter: [{ label: Job['Misc.'], value: Job['Misc.'] }],
  DTPer: [
    { label: Job['Documents/Text'], value: Job['Documents/Text'] },
    { label: Job.Webcomics, value: Job.Webcomics },
    { label: Job.Webnovel, value: Job.Webnovel },
  ],
  'DTP QCer': [
    { label: Job['Documents/Text'], value: Job['Documents/Text'] },
    { label: Job.Webcomics, value: Job.Webcomics },
    { label: Job.Webnovel, value: Job.Webnovel },
  ],
  'Dubbing audio QCer': [{ label: Job.Dubbing, value: Job.Dubbing }],
  'Dubbing script QCer': [{ label: Job.Dubbing, value: Job.Dubbing }],
  'Dubbing script translator': [{ label: Job.Dubbing, value: Job.Dubbing }],
  'Dubbing voice artist': [{ label: Job.Dubbing, value: Job.Dubbing }],

  Editor: [{ label: Job['Misc.'], value: Job['Misc.'] }],
  Interpreter: [{ label: Job.Interpretation, value: Job.Interpretation }],
  Proofreader: [{ label: Job.Webcomics, value: Job.Webcomics }],
  QCer: [
    { label: Job['Documents/Text'], value: Job['Documents/Text'] },
    { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  ],
  'SDH author': [{ label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] }],
  'SDH QCer': [{ label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] }],
  'Subtitle author': [
    { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  ],
  'Subtitle QCer': [{ label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] }],
  'Supp author': [{ label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] }],
  'Supp QCer': [{ label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] }],
  'Template author': [
    { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  ],
  'Template QCer': [{ label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] }],
  Transcriber: [
    { label: Job['Documents/Text'], value: Job['Documents/Text'] },
    { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  ],
  Translator: [
    { label: Job['Documents/Text'], value: Job['Documents/Text'] },
    { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  ],
  'Video editor': [{ label: Job['Misc.'], value: Job['Misc.'] }],
  'Webcomics QCer': [{ label: Job.Webcomics, value: Job.Webcomics }],
  'Webcomics translator': [{ label: Job.Webcomics, value: Job.Webcomics }],
  'Webnovel QCer': [{ label: Job.Webnovel, value: Job.Webnovel }],
  'Webnovel translator': [{ label: Job.Webnovel, value: Job.Webnovel }],
} as const

export const RecruitingStatus = [
  {
    value: 'Ongoing',
    label: 'Ongoing',
  },
  {
    value: 'Paused',
    label: 'Paused',
  },
  {
    value: 'Fulfilled',
    label: 'Fulfilled',
  },
]
