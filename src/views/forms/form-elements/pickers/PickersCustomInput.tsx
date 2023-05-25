// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'

import Icon from 'src/@core/components/icon'
interface PickerProps {
  label?: string
  readOnly?: boolean
  icon?: 'calendar'
  error?: boolean
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly } = props

  if (props.icon) {
    switch (props.icon) {
      case 'calendar':
        return (
          <FormControl fullWidth>
            <InputLabel error={props.error}>{label || ''}</InputLabel>
            <OutlinedInput
              inputRef={ref}
              error={props.error}
              {...props}
              label={label || ''}
              {...(readOnly && { inputProps: { readOnly: true } })}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton edge='end'>
                    <Icon icon='material-symbols:calendar-today-rounded' />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        )
      default:
        return (
          <TextField
            inputRef={ref}
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
      {...props}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default PickersComponent
