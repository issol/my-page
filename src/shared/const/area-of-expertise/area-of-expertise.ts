import { AreaOfExpertise } from './area-of-expertise.enum'

interface AreaOfExpertiseItem {
  value: string
  label: string
}

export const AreaOfExpertiseList: AreaOfExpertiseItem[] = Object.keys(
  AreaOfExpertise,
).map(key => ({
  value: key,
  label: (AreaOfExpertise as { [key: string]: string })[key],
}))

export const AreaOfExpertisePair = {
  'Documents/Text': [
    {
      value: AreaOfExpertise['Academic/Education'],
      label: AreaOfExpertise['Academic/Education'],
    },
    {
      value: AreaOfExpertise['Animals/Pets'],
      label: AreaOfExpertise['Animals/Pets'],
    },
    {
      value: AreaOfExpertise['Beauty/Fashion'],
      label: AreaOfExpertise['Beauty/Fashion'],
    },
    {
      value: AreaOfExpertise['Commerce and financial'],
      label: AreaOfExpertise['Commerce and financial'],
    },
    {
      value: AreaOfExpertise['Computers/Tech'],
      label: AreaOfExpertise['Computers/Tech'],
    },
    {
      value: AreaOfExpertise['Cooking/Food&Drink'],
      label: AreaOfExpertise['Cooking/Food&Drink'],
    },
    {
      value: AreaOfExpertise['Energy and raw materials'],
      label: AreaOfExpertise['Energy and raw materials'],
    },
    {
      value: AreaOfExpertise['Game'],
      label: AreaOfExpertise['Game'],
    },
    {
      value: AreaOfExpertise['Governments/Infographics'],
      label: AreaOfExpertise['Governments/Infographics'],
    },
    {
      value: AreaOfExpertise['Legal'],
      label: AreaOfExpertise['Legal'],
    },
    {
      value: AreaOfExpertise['Marketing'],
      label: AreaOfExpertise['Marketing'],
    },
    {
      value: AreaOfExpertise['Medical/Healthcare(Mental/Physical)'],
      label: AreaOfExpertise['Medical/Healthcare(Mental/Physical)'],
    },
    {
      value: AreaOfExpertise['Movies'],
      label: AreaOfExpertise['Movies'],
    },
    {
      value: AreaOfExpertise['Music/Entertainment'],
      label: AreaOfExpertise['Music/Entertainment'],
    },
    {
      value: AreaOfExpertise['Nature'],
      label: AreaOfExpertise['Nature'],
    },
    {
      value: AreaOfExpertise['Non-profit/Activism'],
      label: AreaOfExpertise['Non-profit/Activism'],
    },
    {
      value: AreaOfExpertise['Police/Military'],
      label: AreaOfExpertise['Police/Military'],
    },
    {
      value: AreaOfExpertise['Political'],
      label: AreaOfExpertise['Political'],
    },
    {
      value: AreaOfExpertise['Proofreading'],
      label: AreaOfExpertise['Proofreading'],
    },
    {
      value: AreaOfExpertise['Science/Engineering'],
      label: AreaOfExpertise['Science/Engineering'],
    },
    {
      value: AreaOfExpertise['Sports'],
      label: AreaOfExpertise['Sports'],
    },
    {
      value: AreaOfExpertise['Travel'],
      label: AreaOfExpertise['Travel'],
    },
    {
      value: AreaOfExpertise['Vehicles(Planes, trains and automobiles)'],
      label: AreaOfExpertise['Vehicles(Planes, trains and automobiles)'],
    },
  ],
  Dubbing: [
    {
      value: AreaOfExpertise['Academic/Education'],
      label: AreaOfExpertise['Academic/Education'],
    },
    {
      value: AreaOfExpertise['Action & Adventure'],
      label: AreaOfExpertise['Action & Adventure'],
    },
    {
      value: AreaOfExpertise['Children & Family'],
      label: AreaOfExpertise['Children & Family'],
    },

    {
      value: AreaOfExpertise['Classic'],
      label: AreaOfExpertise['Classic'],
    },
    {
      value: AreaOfExpertise['Comedy'],
      label: AreaOfExpertise['Comedy'],
    },
    {
      value: AreaOfExpertise['Crime'],
      label: AreaOfExpertise['Crime'],
    },
    {
      value: AreaOfExpertise['Documentaries'],
      label: AreaOfExpertise['Documentaries'],
    },
    {
      value: AreaOfExpertise['Dramas'],
      label: AreaOfExpertise['Dramas'],
    },

    {
      value: AreaOfExpertise['Historical'],
      label: AreaOfExpertise['Historical'],
    },
    {
      value: AreaOfExpertise['Horror'],
      label: AreaOfExpertise['Horror'],
    },
    {
      value: AreaOfExpertise['Music'],
      label: AreaOfExpertise['Music'],
    },
    {
      value: AreaOfExpertise['Romance'],
      label: AreaOfExpertise['Romance'],
    },
    {
      value: AreaOfExpertise['Sci-fi & Fantasy'],
      label: AreaOfExpertise['Sci-fi & Fantasy'],
    },
    {
      value: AreaOfExpertise['Sports'],
      label: AreaOfExpertise['Sports'],
    },
    {
      value: AreaOfExpertise['Superhero'],
      label: AreaOfExpertise['Superhero'],
    },
    {
      value: AreaOfExpertise['Thrillers'],
      label: AreaOfExpertise['Thrillers'],
    },
    {
      value: AreaOfExpertise['TV Shows'],
      label: AreaOfExpertise['TV Shows'],
    },
    {
      value: AreaOfExpertise['Youtube'],
      label: AreaOfExpertise['Youtube'],
    },
  ],
  Interpretation: [
    {
      value: AreaOfExpertise['Academic/Education'],
      label: AreaOfExpertise['Academic/Education'],
    },
    {
      value: AreaOfExpertise['Beauty/Fashion'],
      label: AreaOfExpertise['Beauty/Fashion'],
    },
    {
      value: AreaOfExpertise['Commerce and financial'],
      label: AreaOfExpertise['Commerce and financial'],
    },
    {
      value: AreaOfExpertise['Computers/Tech'],
      label: AreaOfExpertise['Computers/Tech'],
    },
    {
      value: AreaOfExpertise['Cooking/Food&Drink'],
      label: AreaOfExpertise['Cooking/Food&Drink'],
    },
    {
      value: AreaOfExpertise['Energy and raw materials'],
      label: AreaOfExpertise['Energy and raw materials'],
    },
    { value: AreaOfExpertise['Game'], label: AreaOfExpertise['Game'] },
    {
      value: AreaOfExpertise['Governments/Infographics'],
      label: AreaOfExpertise['Governments/Infographics'],
    },

    { value: AreaOfExpertise['Legal'], label: AreaOfExpertise['Legal'] },
    { value: AreaOfExpertise['LGBTQ/BL'], label: AreaOfExpertise['LGBTQ/BL'] },
    {
      value: AreaOfExpertise['Marketing'],
      label: AreaOfExpertise['Marketing'],
    },
    {
      value: AreaOfExpertise['Medical/Healthcare(Mental/Physical)'],
      label: AreaOfExpertise['Medical/Healthcare(Mental/Physical)'],
    },
    { value: AreaOfExpertise['Movies'], label: AreaOfExpertise['Movies'] },
    {
      value: AreaOfExpertise['Music/Entertainment'],
      label: AreaOfExpertise['Music/Entertainment'],
    },
    {
      value: AreaOfExpertise['Non-profit/Activism'],
      label: AreaOfExpertise['Non-profit/Activism'],
    },
    {
      value: AreaOfExpertise['Police/Military'],
      label: AreaOfExpertise['Police/Military'],
    },
    {
      value: AreaOfExpertise['Political'],
      label: AreaOfExpertise['Political'],
    },
    {
      value: AreaOfExpertise['Science/Engineering'],
      label: AreaOfExpertise['Science/Engineering'],
    },
    { value: AreaOfExpertise['Sports'], label: AreaOfExpertise['Sports'] },
    { value: AreaOfExpertise['Travel'], label: AreaOfExpertise['Travel'] },
    {
      value: AreaOfExpertise['Vehicles(Planes, trains and automobiles)'],
      label: AreaOfExpertise['Vehicles(Planes, trains and automobiles)'],
    },
  ],
  'OTT/Subtitle': [
    {
      value: AreaOfExpertise['Academic/Education'],
      label: AreaOfExpertise['Academic/Education'],
    },
    {
      value: AreaOfExpertise['Action & Adventure'],
      label: AreaOfExpertise['Action & Adventure'],
    },
    {
      value: AreaOfExpertise['Children & Family'],
      label: AreaOfExpertise['Children & Family'],
    },

    {
      value: AreaOfExpertise['Classic'],
      label: AreaOfExpertise['Classic'],
    },
    {
      value: AreaOfExpertise['Comedy'],
      label: AreaOfExpertise['Comedy'],
    },
    {
      value: AreaOfExpertise['Crime'],
      label: AreaOfExpertise['Crime'],
    },
    {
      value: AreaOfExpertise['Documentaries'],
      label: AreaOfExpertise['Documentaries'],
    },
    {
      value: AreaOfExpertise['Dramas'],
      label: AreaOfExpertise['Dramas'],
    },

    {
      value: AreaOfExpertise['Historical'],
      label: AreaOfExpertise['Historical'],
    },
    {
      value: AreaOfExpertise['Horror'],
      label: AreaOfExpertise['Horror'],
    },
    {
      value: AreaOfExpertise['Music'],
      label: AreaOfExpertise['Music'],
    },
    {
      value: AreaOfExpertise['Romance'],
      label: AreaOfExpertise['Romance'],
    },
    {
      value: AreaOfExpertise['Sci-fi & Fantasy'],
      label: AreaOfExpertise['Sci-fi & Fantasy'],
    },
    {
      value: AreaOfExpertise['Sports'],
      label: AreaOfExpertise['Sports'],
    },
    {
      value: AreaOfExpertise['Superhero'],
      label: AreaOfExpertise['Superhero'],
    },
    {
      value: AreaOfExpertise['Thrillers'],
      label: AreaOfExpertise['Thrillers'],
    },
    {
      value: AreaOfExpertise['TV Shows'],
      label: AreaOfExpertise['TV Shows'],
    },
    {
      value: AreaOfExpertise['Youtube'],
      label: AreaOfExpertise['Youtube'],
    },
  ],
  'Misc.': AreaOfExpertiseList,
  Webcomics: [
    {
      value: AreaOfExpertise['Action & Adventure'],
      label: AreaOfExpertise['Action & Adventure'],
    },
    {
      value: AreaOfExpertise['Autobiographical'],
      label: AreaOfExpertise['Autobiographical'],
    },
    {
      value: AreaOfExpertise['Comedy'],
      label: AreaOfExpertise['Comedy'],
    },
    {
      value: AreaOfExpertise['Sci-fi & Fantasy'],
      label: AreaOfExpertise['Sci-fi & Fantasy'],
    },
    {
      value: AreaOfExpertise['Game'],
      label: AreaOfExpertise['Game'],
    },
    {
      value: AreaOfExpertise['Romance'],
      label: AreaOfExpertise['Romance'],
    },
    {
      value: AreaOfExpertise['Horror'],
      label: AreaOfExpertise['Horror'],
    },
    {
      value: AreaOfExpertise['Historical'],
      label: AreaOfExpertise['Historical'],
    },
    {
      value: AreaOfExpertise['Governments/Infographics'],
      label: AreaOfExpertise['Governments/Infographics'],
    },

    { value: AreaOfExpertise['LGBTQ/BL'], label: AreaOfExpertise['LGBTQ/BL'] },

    {
      value: AreaOfExpertise['Political'],
      label: AreaOfExpertise['Political'],
    },
    {
      value: AreaOfExpertise['Post-apocalyptic'],
      label: AreaOfExpertise['Post-apocalyptic'],
    },
    {
      value: AreaOfExpertise['School'],
      label: AreaOfExpertise['School'],
    },

    { value: AreaOfExpertise['Sports'], label: AreaOfExpertise['Sports'] },

    {
      value: AreaOfExpertise['Superhero'],
      label: AreaOfExpertise['Superhero'],
    },
  ],
  Webnovel: [
    {
      value: AreaOfExpertise['Action & Adventure'],
      label: AreaOfExpertise['Action & Adventure'],
    },
    {
      value: AreaOfExpertise['Autobiographical'],
      label: AreaOfExpertise['Autobiographical'],
    },
    {
      value: AreaOfExpertise['Comedy'],
      label: AreaOfExpertise['Comedy'],
    },
    {
      value: AreaOfExpertise['Sci-fi & Fantasy'],
      label: AreaOfExpertise['Sci-fi & Fantasy'],
    },
    {
      value: AreaOfExpertise['Computers/Tech'],
      label: AreaOfExpertise['Computers/Tech'],
    },

    { value: AreaOfExpertise['Game'], label: AreaOfExpertise['Game'] },
    {
      value: AreaOfExpertise['Romance'],
      label: AreaOfExpertise['Romance'],
    },
    {
      value: AreaOfExpertise['Horror'],
      label: AreaOfExpertise['Horror'],
    },
    {
      value: AreaOfExpertise['Historical'],
      label: AreaOfExpertise['Historical'],
    },
    { value: AreaOfExpertise['LGBTQ/BL'], label: AreaOfExpertise['LGBTQ/BL'] },

    {
      value: AreaOfExpertise['Political'],
      label: AreaOfExpertise['Political'],
    },
    {
      value: AreaOfExpertise['Post-apocalyptic'],
      label: AreaOfExpertise['Post-apocalyptic'],
    },
    {
      value: AreaOfExpertise['School'],
      label: AreaOfExpertise['School'],
    },
    { value: AreaOfExpertise['Sports'], label: AreaOfExpertise['Sports'] },
    {
      value: AreaOfExpertise['Superhero'],
      label: AreaOfExpertise['Superhero'],
    },
  ],
  Gaming: [
    {
      value: AreaOfExpertise['Action & Adventure'],
      label: AreaOfExpertise['Action & Adventure'],
    },
    {
      value: AreaOfExpertise.Arcade,
      label: AreaOfExpertise.Arcade,
    },
    {
      value: AreaOfExpertise.Card,
      label: AreaOfExpertise.Card,
    },
    {
      value: AreaOfExpertise['Tower defense'],
      label: AreaOfExpertise['Tower defense'],
    },
    {
      value: AreaOfExpertise['Shooter'],
      label: AreaOfExpertise['Shooter'],
    },
    {
      value: AreaOfExpertise.War,
      label: AreaOfExpertise.War,
    },
    {
      value: AreaOfExpertise.Puzzle,
      label: AreaOfExpertise.Puzzle,
    },
    {
      value: AreaOfExpertise.MMORPG,
      label: AreaOfExpertise.MMORPG,
    },
    {
      value: AreaOfExpertise.RPG,
      label: AreaOfExpertise.RPG,
    },

    {
      value: AreaOfExpertise.Racing,
      label: AreaOfExpertise.Racing,
    },
    {
      value: AreaOfExpertise.Puzzle,
      label: AreaOfExpertise.Puzzle,
    },
    {
      value: AreaOfExpertise.Strategy,
      label: AreaOfExpertise.Strategy,
    },
    {
      value: AreaOfExpertise.Stealth,
      label: AreaOfExpertise.Stealth,
    },
    {
      value: AreaOfExpertise.Simulation,
      label: AreaOfExpertise.Simulation,
    },
    {
      value: AreaOfExpertise.Sports,
      label: AreaOfExpertise.Sports,
    },
    {
      value: AreaOfExpertise['Battle Royale'],
      label: AreaOfExpertise['Battle Royale'],
    },
    {
      value: AreaOfExpertise.Horror,
      label: AreaOfExpertise.Horror,
    },
    {
      value: AreaOfExpertise.Survival,
      label: AreaOfExpertise.Survival,
    },
  ],
}
