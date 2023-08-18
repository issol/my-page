import { FormHelperText } from '@mui/material'
import { FieldError, Merge } from 'react-hook-form'

export function renderErrorMsg(
  errors:
    | FieldError
    | Merge<FieldError, (FieldError | undefined)[]>
    | undefined,
) {
  return (
    <>
      {errors && (
        <FormHelperText sx={{ color: 'error.main' }}>
          {errors?.message}
        </FormHelperText>
      )}
    </>
  )
}
