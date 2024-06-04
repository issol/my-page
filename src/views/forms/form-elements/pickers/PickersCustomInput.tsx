// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import { FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { InputBasePropsSizeOverrides } from '@mui/material/InputBase/InputBase'
import { Icon } from '@iconify/react'

interface PickerProps {
  label?: string
  readOnly?: boolean
  icon?: 'calendar'
  error?: boolean
  value?: string
  placeholder?: string
  noLabel?: boolean
  sx?: any
  size?: OverridableStringUnion<'small' | 'medium', InputBasePropsSizeOverrides>
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly, value, placeholder, size, noLabel } = props

  if (props.icon) {
    switch (props.icon) {
      case 'calendar':
        return (
          <FormControl fullWidth size={size}>
            {noLabel ? null : (
              <InputLabel error={props.error}>{label || ''}</InputLabel>
            )}
            <OutlinedInput
              inputRef={ref}
              error={props.error}
              {...props}
              value={value}
              label={noLabel ? undefined : label || ''}
              placeholder={placeholder || ''}
              {...(readOnly && { inputProps: { readOnly: true } })}
              endAdornment={
                <Icon icon='gridicons:calendar' fontSize={24} color='#8D8E9A' />
              }
            />
          </FormControl>
        )
      default:
        return (
          <TextField
            inputRef={ref}
            autoComplete='off'
            {...props}
            label={label || ''}
            {...(readOnly && { inputProps: { readOnly: true } })}
          />
        )
    }
  }
  return (
    <TextField
      inputRef={ref}
      autoComplete='off'
      {...props}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default PickersComponent
