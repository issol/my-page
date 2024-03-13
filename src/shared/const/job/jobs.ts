import { Job } from './job.enum'

export const JobList = [
  { label: Job['Documents/Text'], value: Job['Documents/Text'] },
  { label: Job.Dubbing, value: Job.Dubbing },
  { label: Job.Interpretation, value: Job.Interpretation },
  { label: Job['Misc.'], value: Job['Misc.'] },
  { label: Job['OTT/Subtitle'], value: Job['OTT/Subtitle'] },
  { label: Job.Webcomics, value: Job.Webcomics },
  { label: Job.Webnovel, value: Job.Webnovel },
  { label: Job.Gaming, value: Job.Gaming },
].sort((a, b) => a.label.localeCompare(b.label))

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
