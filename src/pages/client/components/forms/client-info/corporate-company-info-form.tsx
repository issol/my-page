import { Box, Grid, TextField } from '@mui/material'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { CorporateClientInfoType } from '@src/context/types'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

type Props = {
  control: Control<CorporateClientInfoType, any>
  errors: FieldErrors<CorporateClientInfoType>
}
export default function CorporateCompanyInfoForm({ control, errors }: Props) {
  return (
    <>
      <Grid item xs={12}>
        <Controller
          name='registrationNumber'
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              autoFocus
              fullWidth
              label='Business registration number*'
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              error={Boolean(errors.registrationNumber)}
            />
          )}
        />
        {renderErrorMsg(errors.registrationNumber)}
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='representativeName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              label='Name of representative*'
              value={value}
              onChange={onChange}
              error={Boolean(errors.representativeName)}
            />
          )}
        />
        {renderErrorMsg(errors.representativeName)}
      </Grid>
      <Grid item xs={12}>
        <DatePickerWrapper>
          <Controller
            control={control}
            name='commencementDate'
            render={({ field: { onChange, value } }) => {
              const selected = value ? new Date(value) : null
              return (
                <Box sx={{ width: '100%' }}>
                  <DatePicker
                    shouldCloseOnSelect={false}
                    selected={selected}
                    onChange={onChange}
                    placeholderText='MM/DD/YYYY'
                    showYearDropdown
                    scrollableYearDropdown
                    customInput={
                      <CustomInput
                        label='Business commencement date*'
                        icon='calendar'
                        error={Boolean(errors?.commencementDate)}
                      />
                    }
                  />
                </Box>
              )
            }}
          />
        </DatePickerWrapper>
        {renderErrorMsg(errors.commencementDate)}
      </Grid>
    </>
  )
}
