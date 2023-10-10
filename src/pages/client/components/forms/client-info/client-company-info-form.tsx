import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { Fragment } from 'react'
import { v4 as uuidv4 } from 'uuid'

// ** data
import { countries } from 'src/@fake-db/autocomplete'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** types
import { ClientCompanyInfoType } from '@src/context/types'

// ** helpers
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'

type Props = {
  control: Control<ClientCompanyInfoType, any>
  errors: FieldErrors<ClientCompanyInfoType>
  watch: UseFormWatch<ClientCompanyInfoType>
}
export default function ClientCompanyInfoForm({
  control,
  errors,
  watch,
}: Props) {
  function renderPhoneField(key: keyof ClientCompanyInfoType, label: string) {
    return (
      <>
        <Controller
          name={key}
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoFocus
              label={label}
              variant='outlined'
              value={value ?? ''}
              onChange={e => {
                if (isInvalidPhoneNumber(e.target.value)) return
                onChange(e)
              }}
              inputProps={{ maxLength: 50 }}
              error={Boolean(errors[key])}
              placeholder={
                !watch('timezone')?.phone ? `+ 1) 012 345 6789` : `012 345 6789`
              }
              InputProps={{
                startAdornment: watch('timezone')?.phone && (
                  <InputAdornment position='start'>
                    {'+' + watch('timezone')?.phone}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {renderErrorMsg(errors[key])}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name='name'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.name)}
              label='Company name*'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg(errors.name)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='email'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              label='Company email*'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg(errors.email)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={countries as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone*'
                  error={Boolean(errors.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        {renderPhoneField('mobile', 'Mobile phone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('phone', 'Telephone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('fax', 'Fax')}
      </Grid>

      <Grid item xs={12}>
        <Controller
          name='websiteLink'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth error={Boolean(errors.websiteLink)}>
              <InputLabel>Website</InputLabel>
              <OutlinedInput
                value={value ?? ''}
                error={Boolean(errors.websiteLink)}
                onChange={onChange}
                label='Website'
                placeholder='https://www.website.com'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      disabled={Boolean(errors.websiteLink) || !value}
                      onClick={() => window.open(`${value}`, '_blank')}
                    >
                      <Icon icon='material-symbols:open-in-new' opacity={0.7} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
        />
        {renderErrorMsg(errors.websiteLink)}
      </Grid>
    </Fragment>
  )
}
