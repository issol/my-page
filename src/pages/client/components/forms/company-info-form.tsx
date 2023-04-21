import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import { Fragment } from 'react'

// ** data
import { ClientStatus } from '@src/shared/const/status/statuses'
import { countries } from 'src/@fake-db/autocomplete'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** types
import {
  ClientType,
  CompanyInfoFormType,
} from '@src/types/schema/company-info.schema'

// ** helpers
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'
import { CountryType } from '@src/types/sign/personalInfoTypes'

type Props = {
  mode: 'create' | 'update'
  control: Control<CompanyInfoFormType, any>
  //   getValues: UseFormGetValues<CompanyInfoFormType>
  setValue: UseFormSetValue<CompanyInfoFormType>
  //   handleSubmit: UseFormHandleSubmit<CompanyInfoFormType>
  errors: FieldErrors<CompanyInfoFormType>
  watch: UseFormWatch<CompanyInfoFormType>
}
export default function CompanyInfoForm({
  mode,
  control,
  //   getValues,
  setValue,
  //   handleSubmit,
  errors,
  watch,
}: Props) {
  const clientType: Array<ClientType> = ['Company', 'Mr.', 'Ms.']

  function renderCompanyTypeBtn(
    type: ClientType,
    value: ClientType,
    onChange: (...event: any[]) => void,
  ) {
    return (
      <Button
        key={type}
        variant='outlined'
        onClick={() => onChange(type)}
        color={value === type ? 'primary' : 'secondary'}
      >
        {type}
      </Button>
    )
  }

  function renderErrorMsg(key: keyof CompanyInfoFormType) {
    return (
      <>
        {errors[key] && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors[key]?.message}
          </FormHelperText>
        )}
      </>
    )
  }
  function renderPhoneField(key: keyof CompanyInfoFormType, label: string) {
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
                !watch('timezone').phone ? `+ 1) 012 345 6789` : `012 345 6789`
              }
              InputProps={{
                startAdornment: watch('timezone').phone && (
                  <InputAdornment position='start'>
                    {'+' + watch('timezone').phone}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {renderErrorMsg(key)}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name='clientType'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Box display='flex' gap='18px'>
              {clientType.map(item =>
                renderCompanyTypeBtn(item, value, onChange),
              )}
            </Box>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='status'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={ClientStatus}
              onChange={(e, v) => {
                if (!v) onChange({ value: '', label: '' })
                else onChange(v.value)
              }}
              value={
                !value
                  ? { value: '', label: '' }
                  : ClientStatus.filter(item => item.value === value)[0]
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.status)}
                  label='Status*'
                  placeholder='Status*'
                />
              )}
            />
          )}
        />
        {renderErrorMsg('status')}
      </Grid>
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
        {renderErrorMsg('name')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='email'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              label='Email*'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg('email')}
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
                <Box component='li' {...props}>
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
        {renderPhoneField('phone', 'Telephone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('mobile', 'Mobile phone')}
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
        {renderErrorMsg('websiteLink')}
      </Grid>

      {mode === 'create' ? (
        <>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' mb='24px'>
              Memo for client
            </Typography>
            <Controller
              name='memo'
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    rows={4}
                    multiline
                    fullWidth
                    error={Boolean(errors.memo)}
                    label='Write down some information to keep in mind about this client.'
                    value={value ?? ''}
                    onChange={onChange}
                    inputProps={{ maxLength: 500 }}
                  />
                  <Typography variant='body2' mt='12px' textAlign='right'>
                    {value?.length ?? 0}/500
                  </Typography>
                </>
              )}
            />
          </Grid>
        </>
      ) : null}
    </Fragment>
  )
}
