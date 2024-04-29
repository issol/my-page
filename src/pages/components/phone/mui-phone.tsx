import 'react-international-phone/style.css'
import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import Divider from '@mui/material/Divider'
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
}

export default function MuiPhone({
  value,
  onChange,
  ...restProps
}: MUIPhoneProps) {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'kr',
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
          height: '46px',
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
