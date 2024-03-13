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

  { label: Role['Dubbing audio QCer'], value: Role['Dubbing audio QCer'] },
  { label: Role['Dubbing script QCer'], value: Role['Dubbing script QCer'] },
  {
    label: Role['Dubbing script translator'],
    value: Role['Dubbing script translator'],
  },
  { label: Role['Dubbing voice artist'], value: Role['Dubbing voice artist'] },

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
    { label: Role['Document Translator'], value: Role['Document Translator'] },
    { label: Role['Document QCer'], value: Role['Document QCer'] },
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role.Transcriber, value: Role.Transcriber },
    { label: Role.Proofreader, value: Role.Proofreader },
    { label: Role.Translator, value: Role.Translator },
    { label: Role.QCer, value: Role.QCer },
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
    { value: Role['Dubbing script QCer'], label: Role['Dubbing script QCer'] },

    {
      label: Role['Dubbing voice artist'],
      value: Role['Dubbing voice artist'],
    },
    {
      value: Role.QCer,
      label: Role.QCer,
    },
  ],
  Interpretation: [{ label: Role.Interpreter, value: Role.Interpreter }],
  'Misc.': RoleList,

  'OTT/Subtitle': [
    { label: Role['SDH author'], value: Role['SDH author'] },
    { label: Role['SDH QCer'], value: Role['SDH QCer'] },
    { label: Role['Subtitle author'], value: Role['Subtitle author'] },
    { label: Role['Subtitle QCer'], value: Role['Subtitle QCer'] },
    { label: Role['Supp author'], value: Role['Supp author'] },
    { label: Role['Supp QCer'], value: Role['Supp QCer'] },
    { label: Role['Template author'], value: Role['Template author'] },
    { label: Role['Template QCer'], value: Role['Template QCer'] },
    { label: Role.Transcriber, value: Role.Transcriber },
    { label: Role.QCer, value: Role.QCer },
  ],
  Webcomics: [
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['Webcomics QCer'], value: Role['Webcomics QCer'] },
    {
      label: Role['Webcomics translator'],
      value: Role['Webcomics translator'],
    },
    { label: Role.Proofreader, value: Role.Proofreader },
    {
      label: Role.Translator,
      value: Role.Translator,
    },
    {
      label: Role.QCer,
      value: Role.QCer,
    },
  ],
  Webnovel: [
    { label: Role.DTPer, value: Role.DTPer },

    { label: Role['Webnovel QCer'], value: Role['Webnovel QCer'] },
    {
      label: Role['Webnovel translator'],
      value: Role['Webnovel translator'],
    },
    { label: Role.Proofreader, value: Role.Proofreader },
    {
      label: Role.Translator,
      value: Role.Translator,
    },
    {
      label: Role.QCer,
      value: Role.QCer,
    },
  ],
  Gaming: [
    { label: Role.DTPer, value: Role.DTPer },
    { label: Role['Gaming QCer'], value: Role['Gaming QCer'] },
    { label: Role['Gaming Translator'], value: Role['Gaming Translator'] },
    { label: Role.Proofreader, value: Role.Proofreader },
    { label: Role.Translator, value: Role.Translator },
    { label: Role.QCer, value: Role.QCer },
  ],
} as const

export const OnboardingListRolePair: Array<RoleSelectType> = [
  {
    label: Role['Audio describer'],
    value: Role['Audio describer'],
    jobType: [Job['Dubbing'], Job['Misc.']],
  },
  {
    label: Role['Audio description QCer'],
    value: Role['Audio description QCer'],
    jobType: [Job['Dubbing'], Job['Misc.']],
  },
  {
    label: Role.Copywriter,
    value: Role.Copywriter,
    jobType: [Job['Misc.']],
  },
  {
    label: Role.DTPer,
    value: Role.DTPer,
    jobType: [
      Job['Documents/Text'],
      Job.Webcomics,
      Job.Webnovel,
      Job.Gaming,
      Job['Misc.'],
    ],
  },
  {
    label: Role['Document Translator'],
    value: Role['Document Translator'],
    jobType: [Job['Documents/Text'], Job['Misc.']],
  },
  {
    label: Role['Document QCer'],
    value: Role['Document QCer'],
    jobType: [Job['Documents/Text'], Job['Misc.']],
  },
  {
    label: Role['Dubbing audio QCer'],
    value: Role['Dubbing audio QCer'],
    jobType: [Job['Dubbing'], Job['Misc.']],
  },
  {
    label: Role['Dubbing script translator'],
    value: Role['Dubbing script translator'],
    jobType: [Job['Dubbing'], Job['Misc.']],
  },
  {
    label: Role['Dubbing script QCer'],
    value: Role['Dubbing script QCer'],
    jobType: [Job['Dubbing'], Job['Misc.']],
  },
  {
    label: Role['Dubbing voice artist'],
    value: Role['Dubbing voice artist'],
    jobType: [Job['Dubbing'], Job['Misc.']],
  },
  {
    label: Role['Gaming Translator'],
    value: Role['Gaming Translator'],
    jobType: [Job.Gaming, Job['Misc.']],
  },
  {
    label: Role['Gaming QCer'],
    value: Role['Gaming QCer'],
    jobType: [Job.Gaming, Job['Misc.']],
  },

  {
    label: Role.Interpreter,
    value: Role.Interpreter,
    jobType: [Job['Interpretation'], Job['Misc.']],
  },
  {
    label: Role.Proofreader,
    value: Role.Proofreader,
    jobType: [
      Job['Documents/Text'],
      Job.Webcomics,
      Job.Webnovel,
      Job.Gaming,
      Job['Misc.'],
    ],
  },
  {
    label: Role.QCer,
    value: Role.QCer,
    jobType: [
      Job['Documents/Text'],
      Job.Dubbing,
      Job['OTT/Subtitle'],
      Job.Webcomics,
      Job.Webnovel,
      Job.Gaming,
      Job['Misc.'],
    ],
  },
  {
    label: Role['SDH author'],
    value: Role['SDH author'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['SDH QCer'],
    value: Role['SDH QCer'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['Subtitle author'],
    value: Role['Subtitle author'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['Subtitle QCer'],
    value: Role['Subtitle QCer'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['Supp author'],
    value: Role['Supp author'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['Supp QCer'],
    value: Role['Supp QCer'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['Template author'],
    value: Role['Template author'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role['Template QCer'],
    value: Role['Template QCer'],
    jobType: [Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role.Transcriber,
    value: Role.Transcriber,
    jobType: [Job['Documents/Text'], Job['OTT/Subtitle'], Job['Misc.']],
  },
  {
    label: Role.Translator,
    value: Role.Translator,
    jobType: [
      Job['Documents/Text'],
      Job.Webcomics,
      Job.Webnovel,
      Job.Gaming,
      Job['Misc.'],
    ],
  },
  {
    label: Role['Video editor'],
    value: Role['Video editor'],
    jobType: [Job['Misc.']],
  },
  {
    label: Role['Webcomics QCer'],
    value: Role['Webcomics QCer'],
    jobType: [Job['Webcomics'], Job['Misc.']],
  },
  {
    label: Role['Webcomics translator'],
    value: Role['Webcomics translator'],
    jobType: [Job['Webcomics'], Job['Misc.']],
  },
  {
    label: Role['Webnovel QCer'],
    value: Role['Webnovel QCer'],
    jobType: [Job['Webnovel'], Job['Misc.']],
  },
  {
    label: Role['Webnovel translator'],
    value: Role['Webnovel translator'],
    jobType: [Job['Webnovel'], Job['Misc.']],
  },
]
