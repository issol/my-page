import { ServiceType } from './service-type.enum'

interface ServiceTypeItem {
  value: ServiceType
  label: ServiceType
}

export const ServiceTypeList: ServiceTypeItem[] = Object.keys(ServiceType).map(
  key => ({
    value: ServiceType[key as keyof typeof ServiceType],
    label: ServiceType[key as keyof typeof ServiceType],
  }),
)

// export const ServiceTypeList = [
//   {
//     label: ServiceType['Audio description'],
//     value: ServiceType['Audio description'],
//   },
//   {
//     label: ServiceType['Copywriting'],
//     value: ServiceType['Copywriting'],
//   },
//   {
//     label: ServiceType['DTP'],
//     value: ServiceType['DTP'],
//   },
//   {
//     label: ServiceType['DTP QC'],
//     value: ServiceType['DTP QC'],
//   },
//   {
//     label: ServiceType['DTP file prep'],
//     value: ServiceType['DTP file prep'],
//   },
//   {
//     label: ServiceType['Dubbing'],
//     value: ServiceType['Dubbing'],
//   },
//   {
//     label: ServiceType['Dubbing audio QC'],
//     value: ServiceType['Dubbing audio QC'],
//   },
//   {
//     label: ServiceType['Dubbing script QC'],
//     value: ServiceType['Dubbing script QC'],
//   },
//   {
//     label: ServiceType['Dubbing script translation'],
//     value: ServiceType['Dubbing script translation'],
//   },
//   {
//     label: ServiceType['Editing'],
//     value: ServiceType['Editing'],
//   },
//   {
//     label: ServiceType['File preparation'],
//     value: ServiceType['File preparation'],
//   },
//   {
//     label: ServiceType['Final check'],
//     value: ServiceType['Final check'],
//   },
//   {
//     label: ServiceType['In-person'],
//     value: ServiceType['In-person'],
//   },
//   {
//     label: ServiceType['Localization engineering'],
//     value: ServiceType['Localization engineering'],
//   },
//   {
//     label: ServiceType['Online'],
//     value: ServiceType['Online'],
//   },
//   {
//     label: ServiceType['Phone'],
//     value: ServiceType['Phone'],
//   },
//   {
//     label: ServiceType['Proofreading'],
//     value: ServiceType['Proofreading'],
//   },
//   {
//     label: ServiceType['QC review'],
//     value: ServiceType['QC review'],
//   },
//   {
//     label: ServiceType['Rendering/TC editing'],
//     value: ServiceType['Rendering/TC editing'],
//   },
//   {
//     label: ServiceType['Revision(Rework)'],
//     value: ServiceType['Revision(Rework)'],
//   },
//   {
//     label: ServiceType['Subtitle'],
//     value: ServiceType['Subtitle'],
//   },
//   {
//     label: ServiceType['TAE(Translator accept edits)'],
//     value: ServiceType['TAE(Translator accept edits)'],
//   },
//   {
//     label: ServiceType['Transcription'],
//     value: ServiceType['Transcription'],
//   },
//   {
//     label: ServiceType['Translation'],
//     value: ServiceType['Translation'],
//   },
//   {
//     label: ServiceType['Video editing'],
//     value: ServiceType['Video editing'],
//   },
// ]

export const ServiceTypePair = {
  'Documents/Text': [
    { label: ServiceType.Translation, value: ServiceType.Translation },
    {
      label: ServiceType['Quality Control'],
      value: ServiceType['Quality Control'],
    },
    {
      value: ServiceType.Proofreading,
      label: ServiceType.Proofreading,
    },
    {
      value: ServiceType['Desktop Publishing'],
      label: ServiceType['Desktop Publishing'],
    },
    {
      value: ServiceType['Machine Translation Post Editing'],
      label: ServiceType['Machine Translation Post Editing'],
    },
  ],
  Dubbing: [
    { value: ServiceType.Transcription, label: ServiceType.Transcription },
    {
      value: ServiceType.Translation,
      label: ServiceType.Translation,
    },
    {
      value: ServiceType['Quality Control'],
      label: ServiceType['Quality Control'],
    },
    {
      value: ServiceType.Recording,
      label: ServiceType.Recording,
    },
    {
      value: ServiceType['Machine Translation Post Editing'],
      label: ServiceType['Machine Translation Post Editing'],
    },
    {
      value: ServiceType['Lip-sync'],
      label: ServiceType['Lip-sync'],
    },
    {
      value: ServiceType['Voice-over'],
      label: ServiceType['Voice-over'],
    },
    {
      label: ServiceType['Audio description'],
      value: ServiceType['Audio description'],
    },
    {
      value: ServiceType['Pre-mix'],
      label: ServiceType['Pre-mix'],
    },
    {
      value: ServiceType['Post-mix'],
      label: ServiceType['Post-mix'],
    },
    {
      value: ServiceType.PLDL,
      label: ServiceType.PLDL,
    },
  ],
  Interpretation: [
    { label: ServiceType['In-person'], value: ServiceType['In-person'] },
    { label: ServiceType.Online, value: ServiceType.Online },
    { label: ServiceType.Phone, value: ServiceType.Phone },
  ],
  'OTT/Subtitle': [
    {
      value: ServiceType['Rendering/TC editing/Engineering'],
      label: ServiceType['Rendering/TC editing/Engineering'],
    },
    {
      value: ServiceType.Translation,
      label: ServiceType.Translation,
    },
    {
      value: ServiceType['Quality Control'],
      label: ServiceType['Quality Control'],
    },
    {
      value: ServiceType.Consultation,
      label: ServiceType.Consultation,
    },
    {
      value: ServiceType['Machine Translation Post Editing'],
      label: ServiceType['Machine Translation Post Editing'],
    },
    {
      value: ServiceType['SDH/CC'],
      label: ServiceType['SDH/CC'],
    },
    {
      value: ServiceType['Template'],
      label: ServiceType['Template'],
    },
    {
      value: ServiceType['Supplemental/Marketing'],
      label: ServiceType['Supplemental/Marketing'],
    },
  ],
  'Misc.': [
    { label: ServiceType.Consultation, value: ServiceType.Consultation },
    { label: ServiceType.Recording, value: ServiceType.Recording },
    {
      label: ServiceType['Video Editing'],
      value: ServiceType['Video Editing'],
    },
    {
      value: ServiceType.Copywriting,
      label: ServiceType.Copywriting,
    },
  ],
  Webcomics: [
    { value: ServiceType['File Prep'], label: ServiceType['File Prep'] },
    { value: ServiceType.Translation, label: ServiceType.Translation },
    {
      value: ServiceType['Quality Control'],
      label: ServiceType['Quality Control'],
    },
    {
      value: ServiceType.Proofreading,
      label: ServiceType.Proofreading,
    },
    {
      value: ServiceType['Desktop Publishing'],
      label: ServiceType['Desktop Publishing'],
    },
    {
      value: ServiceType['Machine Translation Post Editing'],
      label: ServiceType['Machine Translation Post Editing'],
    },
  ],
  Webnovel: [
    { value: ServiceType.Translation, label: ServiceType.Translation },
    {
      value: ServiceType['Quality Control'],
      label: ServiceType['Quality Control'],
    },
    {
      value: ServiceType.Proofreading,
      label: ServiceType.Proofreading,
    },
    {
      value: ServiceType['Machine Translation Post Editing'],
      label: ServiceType['Machine Translation Post Editing'],
    },
  ],
  Gaming: [
    { value: ServiceType.Translation, label: ServiceType.Translation },
    {
      value: ServiceType['Quality Control'],
      label: ServiceType['Quality Control'],
    },
    {
      value: ServiceType.Proofreading,
      label: ServiceType.Proofreading,
    },
    {
      value: ServiceType['Desktop Publishing'],
      label: ServiceType['Desktop Publishing'],
    },
    {
      value: ServiceType['Machine Translation Post Editing'],
      label: ServiceType['Machine Translation Post Editing'],
    },
  ],
}
