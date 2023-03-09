import { Role } from './role.enum'

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
