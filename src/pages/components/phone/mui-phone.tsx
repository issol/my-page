import 'react-international-phone/style.css'
import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone'

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string
  onChange: (phone: string) => void
  defaultValue?: CountryIso2
  height?: string
}

export const CountryIso2Values = {
  af: 'af',
  al: 'al',
  dz: 'dz',
  ad: 'ad',
  ao: 'ao',
  ag: 'ag',
  ar: 'ar',
  am: 'am',
  aw: 'aw',
  au: 'au',
  at: 'at',
  az: 'az',
  bs: 'bs',
  bh: 'bh',
  bd: 'bd',
  bb: 'bb',
  by: 'by',
  be: 'be',
  bz: 'bz',
  bj: 'bj',
  bt: 'bt',
  bo: 'bo',
  ba: 'ba',
  bw: 'bw',
  br: 'br',
  io: 'io',
  bn: 'bn',
  bg: 'bg',
  bf: 'bf',
  bi: 'bi',
  kh: 'kh',
  cm: 'cm',
  ca: 'ca',
  cv: 'cv',
  bq: 'bq',
  cf: 'cf',
  td: 'td',
  cl: 'cl',
  cn: 'cn',
  co: 'co',
  km: 'km',
  cd: 'cd',
  cg: 'cg',
  cr: 'cr',
  ci: 'ci',
  hr: 'hr',
  cu: 'cu',
  cw: 'cw',
  cy: 'cy',
  cz: 'cz',
  dk: 'dk',
  dj: 'dj',
  dm: 'dm',
  do: 'do',
  ec: 'ec',
  eg: 'eg',
  sv: 'sv',
  gq: 'gq',
  er: 'er',
  ee: 'ee',
  et: 'et',
  fj: 'fj',
  fi: 'fi',
  fr: 'fr',
  gf: 'gf',
  pf: 'pf',
  ga: 'ga',
  gm: 'gm',
  ge: 'ge',
  de: 'de',
  gh: 'gh',
  gr: 'gr',
  gd: 'gd',
  gp: 'gp',
  gu: 'gu',
  gt: 'gt',
  gn: 'gn',
  gw: 'gw',
  gy: 'gy',
  ht: 'ht',
  hn: 'hn',
  hk: 'hk',
  hu: 'hu',
  is: 'is',
  in: 'in',
  id: 'id',
  ir: 'ir',
  iq: 'iq',
  ie: 'ie',
  il: 'il',
  it: 'it',
  jm: 'jm',
  jp: 'jp',
  jo: 'jo',
  kz: 'kz',
  ke: 'ke',
  ki: 'ki',
  xk: 'xk',
  kw: 'kw',
  kg: 'kg',
  la: 'la',
  lv: 'lv',
  lb: 'lb',
  ls: 'ls',
  lr: 'lr',
  ly: 'ly',
  li: 'li',
  lt: 'lt',
  lu: 'lu',
  mo: 'mo',
  mk: 'mk',
  mg: 'mg',
  mw: 'mw',
  my: 'my',
  mv: 'mv',
  ml: 'ml',
  mt: 'mt',
  mh: 'mh',
  mq: 'mq',
  mr: 'mr',
  mu: 'mu',
  mx: 'mx',
  fm: 'fm',
  md: 'md',
  mc: 'mc',
  mn: 'mn',
  me: 'me',
  ma: 'ma',
  mz: 'mz',
  mm: 'mm',
  na: 'na',
  nr: 'nr',
  np: 'np',
  nl: 'nl',
  nc: 'nc',
  nz: 'nz',
  ni: 'ni',
  ne: 'ne',
  ng: 'ng',
  kp: 'kp',
  no: 'no',
  om: 'om',
  pk: 'pk',
  pw: 'pw',
  ps: 'ps',
  pa: 'pa',
  pg: 'pg',
  py: 'py',
  pe: 'pe',
  ph: 'ph',
  pl: 'pl',
  pt: 'pt',
  pr: 'pr',
  qa: 'qa',
  re: 're',
  ro: 'ro',
  ru: 'ru',
  rw: 'rw',
  kn: 'kn',
  lc: 'lc',
  vc: 'vc',
  ws: 'ws',
  sm: 'sm',
  st: 'st',
  sa: 'sa',
  sn: 'sn',
  rs: 'rs',
  sc: 'sc',
  sl: 'sl',
  sg: 'sg',
  sk: 'sk',
  si: 'si',
  sb: 'sb',
  so: 'so',
  za: 'za',
  kr: 'kr',
  ss: 'ss',
  es: 'es',
  lk: 'lk',
  sd: 'sd',
  sr: 'sr',
  sz: 'sz',
  se: 'se',
  ch: 'ch',
  sy: 'sy',
  tw: 'tw',
  tj: 'tj',
  tz: 'tz',
  th: 'th',
  tl: 'tl',
  tg: 'tg',
  to: 'to',
  tt: 'tt',
  tn: 'tn',
  tr: 'tr',
  tm: 'tm',
  tv: 'tv',
  ug: 'ug',
  ua: 'ua',
  ae: 'ae',
  gb: 'gb',
  us: 'us',
  uy: 'uy',
  uz: 'uz',
  vu: 'vu',
  va: 'va',
  ve: 've',
  vn: 'vn',
  ye: 'ye',
  zm: 'zm',
  zw: 'zw',
} as const

export default function MuiPhone({
  value,
  onChange,
  defaultValue,
  height = '46px',
  ...restProps
}: MUIPhoneProps) {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      // defaultCountry: 'kr',
      defaultCountry: defaultValue ?? 'kr',
      disableFormatting: true,
      forceDialCode: true,
      value,
      countries: defaultCountries,
      onChange: data => {
        onChange(data.inputValue.replace(' ', '|').replace('+', ''))
      },
    })

  return (
    <TextField
      sx={{
        width: '100%',
      }}
      autoComplete='off'
      variant='outlined'
      // label='Phone number'
      color='primary'
      placeholder='Phone number'
      value={inputValue}
      onChange={handlePhoneValueChange}
      type='tel'
      inputRef={inputRef}
      InputProps={{
        style: {
          height,
          padding: '0 14px',
        },
        startAdornment: (
          <InputAdornment position='start'>
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '6px',
                  left: '-92px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: '80px',
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  left: '0 !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={e => setCountry(e.target.value as CountryIso2)}
              renderValue={value => (
                <FlagImage iso2={value} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map(c => {
                const country = parseCountry(c)
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Typography marginRight='8px'>{country.name}</Typography>
                    <Typography color='gray'>+{country.dialCode}</Typography>
                  </MenuItem>
                )
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  )
}
