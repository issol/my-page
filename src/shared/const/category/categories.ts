import { Category } from './category.enum'
import { ServiceType } from '../service-type/service-type.enum'
export const CategoryList = [
  { label: Category['Documents/Text'], value: Category['Documents/Text'] },
  { label: Category.Dubbing, value: Category.Dubbing },
  { label: Category.Interpretation, value: Category.Interpretation },
  { label: Category['Misc.'], value: Category['Misc.'] },
  { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  { label: Category.Webcomics, value: Category.Webcomics },
  { label: Category.Webnovel, value: Category.Webnovel },
  { label: Category.Gaming, value: Category.Gaming },
]

export const CategoryListPair = {
  [ServiceType['Translation']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Dubbing, value: Category.Dubbing },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
    {
      label: Category.Gaming,
      value: Category.Gaming,
    },
  ],
  [ServiceType['Quality Control']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Dubbing, value: Category.Dubbing },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
    {
      label: Category.Gaming,
      value: Category.Gaming,
    },
  ],

  [ServiceType['Proofreading']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Gaming, value: Category.Gaming },
  ],
  [ServiceType['Desktop Publishing']]: [
    {
      label: Category['Documents/Text'],
      value: Category['Documents/Text'],
    },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Gaming, value: Category.Gaming },
  ],
  [ServiceType['Machine Translation Post Editing']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Dubbing, value: Category.Dubbing },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Gaming, value: Category.Gaming },
  ],

  [ServiceType['Transcription']]: [
    { label: Category['Dubbing'], value: Category['Dubbing'] },
  ],

  [ServiceType.Recording]: [
    { label: Category.Dubbing, value: Category.Dubbing },
    { value: Category['Misc.'], label: Category['Misc.'] },
  ],

  [ServiceType['Lip-sync']]: [
    { label: Category.Dubbing, value: Category.Dubbing },
  ],

  [ServiceType['Voice-over']]: [
    { label: Category.Dubbing, value: Category.Dubbing },
  ],
  [ServiceType['Audio description']]: [
    { label: Category.Dubbing, value: Category.Dubbing },
  ],
  [ServiceType['Pre-mix']]: [
    { label: Category.Dubbing, value: Category.Dubbing },
  ],
  [ServiceType['Post-mix']]: [
    { label: Category.Dubbing, value: Category.Dubbing },
  ],

  [ServiceType['In-person']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],
  [ServiceType['Online']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],
  [ServiceType['Phone']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],

  [ServiceType['Rendering/TC editing/Engineering']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['Consultation']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    {
      label: Category['Misc.'],
      value: Category['Misc.'],
    },
  ],
  [ServiceType['SDH/CC']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['Template/PLDL']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['Supplemental/Marketing']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['File Prep']]: [
    { label: Category['Webcomics'], value: Category['Webcomics'] },
  ],
  [ServiceType['Video Editing']]: [
    { label: Category['Misc.'], value: Category['Misc.'] },
  ],
  [ServiceType['Copywriting']]: [
    { label: Category['Misc.'], value: Category['Misc.'] },
  ],
}
