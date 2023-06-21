export enum PriceRoundingResponseEnum {
  Type_0 = 'Round (Round down to 0.5 - round up from 0.5)', // 반올림
  Type_1 = 'Round up (e.g. <1.0 becomes 1.0)', // 올림
  Type_2 = 'Truncate', // 버림
  Type_3 = 'Rounding (0.5)', // 조건 반올림
  Type_4 = 'Round up (0.5)', // 0.5 올림
}
