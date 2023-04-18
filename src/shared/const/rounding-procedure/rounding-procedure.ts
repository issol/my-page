import { PriceRoundingResponseEnum } from './rounding-procedure.enum'

export const RoundingProcedureList = [
  {
    label: PriceRoundingResponseEnum.Type_0,
    value: 0,
  },
  {
    label: PriceRoundingResponseEnum.Type_1,
    value: 1,
  },
  {
    label: PriceRoundingResponseEnum.Type_2,
    value: 2,
  },

  {
    label: PriceRoundingResponseEnum.Type_3,
    value: 3,
  },
  {
    label: PriceRoundingResponseEnum.Type_4,
    value: 4,
  },
]

export const RoundingProcedureObj = {
  [PriceRoundingResponseEnum.Type_0]: 0,
  [PriceRoundingResponseEnum.Type_1]: 1,
  [PriceRoundingResponseEnum.Type_2]: 2,
  [PriceRoundingResponseEnum.Type_3]: 3,
  [PriceRoundingResponseEnum.Type_4]: 4,
}
export const RoundingProcedureObjReversed = {
  0: PriceRoundingResponseEnum.Type_0,
  1: PriceRoundingResponseEnum.Type_1,
  2: PriceRoundingResponseEnum.Type_2,
  3: PriceRoundingResponseEnum.Type_3,
  4: PriceRoundingResponseEnum.Type_4,
}
