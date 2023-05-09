export type MemSourceType = {
  id: number
  toolName: 'memesource' | 'memoq'
  calculationBasis: Array<'Words' | 'Character'>
  targetLanguage: string | null
  data: Array<MemSourceData>
}

export type MemoQType = {
  id: number
  toolName: 'memesource' | 'memoq'
  calculationBasis: Array<'Words' | 'Character'>
  targetLanguage: string | null
  data: Array<MemoQData>
}

export type MemSourceInterface =
  | 'Context Match'
  | 'Repetitions'
  | '100%'
  | '95% - 99%'
  | '85% - 94%'
  | '75% - 84%'
  | '50% - 74%'
  | 'No Match'
  | 'Total'
export type MemSourceData = {
  File: string
  'Chars/Word': string
  'Tagging Errors': string
} & {
  [K in MemSourceInterface]: TMDataType
}

export type MemoQInterface =
  | 'X-translated'
  | '101%'
  | 'Repetitions'
  | '100%'
  | '95% - 99%'
  | '85% - 94%'
  | '75% - 84%'
  | '50% - 74%'
  | 'No Match'
  | 'Fragments'
  | 'Total'
export type MemoQData = {
  File: string
  'Chars/Word': string
} & {
  [K in MemoQInterface]: TMDataType
}

export type TMDataType = {
  Words?: string
  Characters?: string
  Percent: string
}
