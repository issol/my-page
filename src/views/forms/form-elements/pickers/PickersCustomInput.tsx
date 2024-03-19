// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import { FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { InputBasePropsSizeOverrides } from '@mui/material/InputBase/InputBase'

interface PickerProps {
  label?: string
  readOnly?: boolean
  icon?: 'calendar'
  error?: boolean
  value?: string
  placeholder?: string
  sx?: any
  size?: OverridableStringUnion<'small' | 'medium', InputBasePropsSizeOverrides>
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly, value, placeholder, size } = props

  if (props.icon) {
    switch (props.icon) {
      case 'calendar':
        return (
          <FormControl fullWidth size={size}>
            <InputLabel error={props.error}>{label || ''}</InputLabel>
            <OutlinedInput
              inputRef={ref}
              error={props.error}
              {...props}
              value={value}
              label={label || ''}
              placeholder={placeholder || ''}
              {...(readOnly && { inputProps: { readOnly: true } })}
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
