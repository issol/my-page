import { RoleSelectType } from '@src/types/onboarding/list'
import { Role } from './role.enum'
import { Job } from '../job/job.enum'

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

export const OnboardingListRolePair: Array<RoleSelectType> = [
  {
    label: Role['Audio describer'],
    value: Role['Audio describer'],
    jobType: [Job['Dubbing']],
  },
  {
    label: Role['Audio description QCer'],
    value: Role['Audio description QCer'],
    jobType: [Job['Dubbing']],
  },
  {
    label: Role.Copywriter,
    value: Role.Copywriter,
    jobType: [Job['Misc.']],
  },
  {
    label: Role.DTPer,
    value: Role.DTPer,
    jobType: [Job['Documents/Text'], Job.Webcomics, Job.Webnovel],
  },
  {
    label: Role['DTP QCer'],
    value: Role['DTP QCer'],
    jobType: [Job['Documents/Text'], Job.Webcomics, Job.Webnovel],
  },
  {
    label: Role['Dubbing audio QCer'],
    value: Role['Dubbing audio QCer'],
    jobType: [Job['Dubbing']],
  },
  {
    label: Role['Dubbing script QCer'],
    value: Role['Dubbing script QCer'],
    jobType: [Job['Dubbing']],
  },
  {
    label: Role.Editor,
    value: Role.Editor,
    jobType: [Job['Misc.']],
  },
  {
    label: Role.Interpreter,
    value: Role.Interpreter,
    jobType: [Job['Interpretation']],
  },
  {
    label: Role.Proofreader,
    value: Role.Proofreader,
    jobType: [Job.Webcomics],
  },
  {
    label: Role.QCer,
    value: Role.QCer,
    jobType: [Job['Documents/Text'], Job['OTT/Subtitle']],
  },
  {
    label: Role['SDH author'],
    value: Role['SDH author'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['SDH QCer'],
    value: Role['SDH QCer'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['Subtitle author'],
    value: Role['Subtitle author'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['Subtitle QCer'],
    value: Role['Subtitle QCer'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['Supp author'],
    value: Role['Supp author'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['Supp QCer'],
    value: Role['Supp QCer'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['Template author'],
    value: Role['Template author'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role['Template QCer'],
    value: Role['Template QCer'],
    jobType: [Job['OTT/Subtitle']],
  },
  {
    label: Role.Transcriber,
    value: Role.Transcriber,
    jobType: [Job['Documents/Text'], Job['OTT/Subtitle']],
  },
  {
    label: Role.Translator,
    value: Role.Translator,
    jobType: [Job['Documents/Text'], Job['OTT/Subtitle']],
  },
  {
    label: Role['Video editor'],
    value: Role['Video editor'],
    jobType: [Job['Misc.']],
  },
  {
    label: Role['Webcomics QCer'],
    value: Role['Webcomics QCer'],
    jobType: [Job['Webcomics']],
  },
  {
    label: Role['Webcomics translator'],
    value: Role['Webcomics translator'],
    jobType: [Job['Webcomics']],
  },
  {
    label: Role['Webnovel QCer'],
    value: Role['Webnovel QCer'],
    jobType: [Job['Webnovel']],
  },
  {
    label: Role['Webnovel translator'],
    value: Role['Webnovel translator'],
    jobType: [Job['Webnovel']],
  },
]

export const AssignJobType = {
  'Documents/Text': [
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['DTP QCer'], value: Role['DTP QCer'] },
    { label: Role.QCer, value: Role.QCer },
    { label: Role.Transcriber, value: Role.Transcriber },
    { label: Role.Translator, value: Role.Translator },
    { label: 'Localization engineer', value: 'Localization engineer' },
    { label: 'Reviewer', value: 'Reviewer' },
  ],
  Dubbing: [
    { label: 'Reviewer', value: 'Reviewer' },
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
  Interpretation: [
    { label: 'Reviewer', value: 'Reviewer' },
    { label: Role.Interpreter, value: Role.Interpreter },
  ],
  'Misc.': [
    { label: 'Content LQA reviewer', value: 'Content LQA reviewer' },
    { label: 'DTT reviewer', value: 'DTT reviewer' },
    { label: 'Language manager', value: 'Language manager' },
    { label: 'Reviewer', value: 'Reviewer' },
    { label: 'Vendor LM', value: 'Vendor LM' },
    { label: Role.Copywriter, value: Role.Copywriter },
    { label: Role.Editor, value: Role.Editor },
    { label: Role['Video editor'], value: Role['Video editor'] },
  ],

  'OTT/Subtitle': [
    { label: 'Content LQA reviewer', value: 'Content LQA reviewer' },
    { label: 'DTT reviewer', value: 'DTT reviewer' },
    { label: 'Language manager', value: 'Language manager' },
    { label: 'Reviewer', value: 'Reviewer' },
    { label: 'Vendor LM', value: 'Vendor LM' },
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
    { label: 'Localization engineer', value: 'Localization engineer' },
    { label: 'Reviewer', value: 'Reviewer' },
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
    { label: 'Localization engineer', value: 'Localization engineer' },
    { label: 'Reviewer', value: 'Reviewer' },
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['DTP QCer'], value: Role['DTP QCer'] },
    { label: Role['Webnovel QCer'], value: Role['Webnovel QCer'] },
    {
      label: Role['Webcomics translator'],
      value: Role['Webcomics translator'],
    },
  ],
} as const
