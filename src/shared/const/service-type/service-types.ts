import { ServiceType } from './service-type.enum'

export const ServiceTypeList = [
  {
    label: ServiceType['Audio description'],
    value: ServiceType['Audio description'],
  },
  {
    label: ServiceType['Copywriting'],
    value: ServiceType['Copywriting'],
  },
  {
    label: ServiceType['DTP'],
    value: ServiceType['DTP'],
  },
  {
    label: ServiceType['DTP QC'],
    value: ServiceType['DTP QC'],
  },
  {
    label: ServiceType['DTP file prep'],
    value: ServiceType['DTP file prep'],
  },
  {
    label: ServiceType['Dubbing'],
    value: ServiceType['Dubbing'],
  },
  {
    label: ServiceType['Dubbing audio QC'],
    value: ServiceType['Dubbing audio QC'],
  },
  {
    label: ServiceType['Dubbing script QC'],
    value: ServiceType['Dubbing script QC'],
  },
  {
    label: ServiceType['Dubbing script translation'],
    value: ServiceType['Dubbing script translation'],
  },
  {
    label: ServiceType['Editing'],
    value: ServiceType['Editing'],
  },
  {
    label: ServiceType['File preparation'],
    value: ServiceType['File preparation'],
  },
  {
    label: ServiceType['Final check'],
    value: ServiceType['Final check'],
  },
  {
    label: ServiceType['In-person'],
    value: ServiceType['In-person'],
  },
  {
    label: ServiceType['Localization engineering'],
    value: ServiceType['Localization engineering'],
  },
  {
    label: ServiceType['Online'],
    value: ServiceType['Online'],
  },
  {
    label: ServiceType['Phone'],
    value: ServiceType['Phone'],
  },
  {
    label: ServiceType['Proofreading'],
    value: ServiceType['Proofreading'],
  },
  {
    label: ServiceType['QC review'],
    value: ServiceType['QC review'],
  },
  {
    label: ServiceType['Rendering/TC editing'],
    value: ServiceType['Rendering/TC editing'],
  },
  {
    label: ServiceType['Revision(Rework)'],
    value: ServiceType['Revision(Rework)'],
  },
  {
    label: ServiceType['Subtitle'],
    value: ServiceType['Subtitle'],
  },
  {
    label: ServiceType['TAE(Translator accept edits)'],
    value: ServiceType['TAE(Translator accept edits)'],
  },
  {
    label: ServiceType['Transcription'],
    value: ServiceType['Transcription'],
  },
  {
    label: ServiceType['Translation'],
    value: ServiceType['Translation'],
  },
  {
    label: ServiceType['Video editing'],
    value: ServiceType['Video editing'],
  },
]

export const ServiceTypePair = {
  'Documents/Text': [
    { label: ServiceType.Copywriting, value: ServiceType.Copywriting },
    { label: ServiceType.DTP, value: ServiceType.DTP },
    { label: ServiceType['DTP QC'], value: ServiceType['DTP QC'] },
    {
      label: ServiceType['DTP file prep'],
      value: ServiceType['DTP file prep'],
    },
    { label: ServiceType.Editing, value: ServiceType.Editing },
    {
      label: ServiceType['File preparation'],
      value: ServiceType['File preparation'],
    },
    { label: ServiceType['Final check'], value: ServiceType['Final check'] },
    {
      label: ServiceType['Localization engineering'],
      value: ServiceType['Localization engineering'],
    },
    { label: ServiceType.Proofreading, value: ServiceType.Proofreading },
    { label: ServiceType['QC review'], value: ServiceType['QC review'] },
    {
      label: ServiceType['Revision(Rework)'],
      value: ServiceType['Revision(Rework)'],
    },
    {
      label: ServiceType['TAE(Translator accept edits)'],
      value: ServiceType['TAE(Translator accept edits)'],
    },
    { label: ServiceType.Transcription, value: ServiceType.Transcription },
    { label: ServiceType.Translation, value: ServiceType.Translation },
  ],
  Dubbing: [
    {
      label: ServiceType['Audio description'],
      value: ServiceType['Audio description'],
    },
    { label: ServiceType.Dubbing, value: ServiceType.Dubbing },
    {
      label: ServiceType['Dubbing audio QC'],
      value: ServiceType['Dubbing audio QC'],
    },
    {
      label: ServiceType['Dubbing script QC'],
      value: ServiceType['Dubbing script QC'],
    },
    {
      label: ServiceType['Dubbing script translation'],
      value: ServiceType['Dubbing script translation'],
    },
    { label: ServiceType['QC review'], value: ServiceType['QC review'] },
    { label: ServiceType.Translation, value: ServiceType.Translation },
  ],
  Interpretation: [
    { label: ServiceType['In-person'], value: ServiceType['In-person'] },
    { label: ServiceType.Online, value: ServiceType.Online },
    { label: ServiceType.Phone, value: ServiceType.Phone },
  ],
  'Misc.': [
    { label: ServiceType.Copywriting, value: ServiceType.Copywriting },
    { label: ServiceType.Editing, value: ServiceType.Editing },
    {
      label: ServiceType['Video editing'],
      value: ServiceType['Video editing'],
    },
  ],
  'OTT/Subtitle': [
    { value: ServiceType.Editing, label: ServiceType.Editing },
    {
      value: ServiceType['File preparation'],
      label: ServiceType['File preparation'],
    },
    { value: ServiceType['Final check'], label: ServiceType['Final check'] },
    { value: ServiceType['QC review'], label: ServiceType['QC review'] },
    {
      value: ServiceType['Rendering/TC editing'],
      label: ServiceType['Rendering/TC editing'],
    },
    {
      value: ServiceType['Revision(Rework)'],
      label: ServiceType['Revision(Rework)'],
    },
    { value: ServiceType.Subtitle, label: ServiceType.Subtitle },
    {
      value: ServiceType['TAE(Translator accept edits)'],
      label: ServiceType['TAE(Translator accept edits)'],
    },
    { value: ServiceType.Transcription, label: ServiceType.Transcription },
    { value: ServiceType.Translation, label: ServiceType.Translation },
    {
      value: ServiceType['Video editing'],
      label: ServiceType['Video editing'],
    },
  ],
  Webcomics: [
    { value: ServiceType.Copywriting, label: ServiceType.Copywriting },
    { value: ServiceType.DTP, label: ServiceType.DTP },
    { value: ServiceType['DTP QC'], label: ServiceType['DTP QC'] },
    {
      value: ServiceType['DTP file prep'],
      label: ServiceType['DTP file prep'],
    },
    { value: ServiceType.Editing, label: ServiceType.Editing },
    {
      value: ServiceType['File preparation'],
      label: ServiceType['File preparation'],
    },
    { value: ServiceType['Final check'], label: ServiceType['Final check'] },
    {
      value: ServiceType['Localization engineering'],
      label: ServiceType['Localization engineering'],
    },
    { value: ServiceType.Proofreading, label: ServiceType.Proofreading },
    { value: ServiceType['QC review'], label: ServiceType['QC review'] },
    {
      value: ServiceType['Revision(Rework)'],
      label: ServiceType['Revision(Rework)'],
    },
    {
      value: ServiceType['TAE(Translator accept edits)'],
      label: ServiceType['TAE(Translator accept edits)'],
    },
    { value: ServiceType.Transcription, label: ServiceType.Transcription },
    { value: ServiceType.Translation, label: ServiceType.Translation },
  ],
  Webnovel: [
    { value: ServiceType.Copywriting, label: ServiceType.Copywriting },
    { value: ServiceType.DTP, label: ServiceType.DTP },
    { value: ServiceType['DTP QC'], label: ServiceType['DTP QC'] },
    {
      value: ServiceType['DTP file prep'],
      label: ServiceType['DTP file prep'],
    },
    { value: ServiceType.Editing, label: ServiceType.Editing },
    {
      value: ServiceType['File preparation'],
      label: ServiceType['File preparation'],
    },
    { value: ServiceType['Final check'], label: ServiceType['Final check'] },
    {
      value: ServiceType['Localization engineering'],
      label: ServiceType['Localization engineering'],
    },
    { value: ServiceType['QC review'], label: ServiceType['QC review'] },
    {
      value: ServiceType['Revision(Rework)'],
      label: ServiceType['Revision(Rework)'],
    },
    {
      value: ServiceType['TAE(Translator accept edits)'],
      label: ServiceType['TAE(Translator accept edits)'],
    },
    { value: ServiceType.Transcription, label: ServiceType.Transcription },
    { value: ServiceType.Translation, label: ServiceType.Translation },
  ],
}
