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
]

export const CategoryListPair = {
  [ServiceType['Audio description']]: [
    { value: Category.Dubbing, label: Category.Dubbing },
  ],
  [ServiceType['Copywriting']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['Misc.'], value: Category['Misc.'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['DTP']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['DTP QC']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['DTP file prep']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Dubbing']]: [
    { value: Category.Dubbing, label: Category.Dubbing },
  ],
  [ServiceType['Dubbing audio QC']]: [
    { value: Category.Dubbing, label: Category.Dubbing },
  ],
  [ServiceType['Dubbing script QC']]: [
    { value: Category.Dubbing, label: Category.Dubbing },
  ],
  [ServiceType['Dubbing script translation']]: [
    { value: Category.Dubbing, label: Category.Dubbing },
  ],
  [ServiceType['Editing']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['Misc.'], value: Category['Misc.'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['File preparation']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Final check']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['In-person']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],
  [ServiceType['Localization engineering']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Online']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],
  [ServiceType['Phone']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],
  [ServiceType['Proofreading']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['QC review']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Dubbing, value: Category.Dubbing },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Rendering/TC editing']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['Revision(Rework)']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Subtitle']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['TAE(Translator accept edits)']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Transcription']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Translation']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Dubbing, value: Category.Dubbing },
    { label: Category.Webcomics, value: Category.Webcomics },
    { label: Category.Webnovel, value: Category.Webnovel },
  ],
  [ServiceType['Video editing']]: [
    { label: Category['Misc.'], value: Category['Misc.'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
}
