import { Category } from './category.enum'
import { ServiceType } from '../service-type/service-type.enum'
export const CategoryList = [
  { label: Category['Documents/Text'], value: Category['Documents/Text'] },
  { label: Category.Dubbing, value: Category.Dubbing },
  { label: Category.Interpretation, value: Category.Interpretation },
  { label: Category['Misc.'], value: Category['Misc.'] },
  { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  { label: Category.Webnovel, value: Category.Webnovel },
  { label: Category.Webcomics, value: Category.Webcomics },
]

export const CategoryListPair = {
  [ServiceType['Audio description']]: [
    { value: Category.Dubbing, label: Category.Dubbing },
  ],
  [ServiceType['Copywriting']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['Misc.'], value: Category['Misc.'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['DTP']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['DTP QC']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['DTP file prep']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
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
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['File preparation']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['Final check']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['In-person']]: [
    { label: Category.Interpretation, value: Category.Interpretation },
  ],
  [ServiceType['Localization engineering']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
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
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['Rendering/TC editing']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['Revision(Rework)']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['Subtitle']]: [
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
  [ServiceType['TAE(Translator accept edits)']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['Transcription']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['Translation']]: [
    { label: Category['Documents/Text'], value: Category['Documents/Text'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
    { label: Category.Dubbing, value: Category.Dubbing },
    { label: Category.Webnovel, value: Category.Webnovel },
    { label: Category.Webcomics, value: Category.Webcomics },
  ],
  [ServiceType['Video editing']]: [
    { label: Category['Misc.'], value: Category['Misc.'] },
    { label: Category['OTT/Subtitle'], value: Category['OTT/Subtitle'] },
  ],
}
