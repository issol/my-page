// ** React Imports
import {
  useState,
  ReactNode,
  MouseEvent,
  useEffect,
  useMemo,
  useCallback,
} from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import {
  Card,
  CardContent,
  FormControlLabel,
  Link,
  useMediaQuery,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports

import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Checkbox } from '@mui/material'
import { checkEmailDuplication } from 'src/apis/sign.api'
import { RoleType } from 'src/types/apps/userTypes'
import { useMutation } from 'react-query'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { JobList, Pronunciation } from 'src/shared/const/personalInfo'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import {
  CountryType,
  PersonalInfo,
  PronounceType,
} from 'src/types/sign/personalInfoTypes'
import { profileSchema } from 'src/types/schema/profile.schema'

const RightWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  backgroundColor: '#ffffff',
}))
const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
}))

const TypographyStyled = muiStyled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) },
  }),
)

const Illustration = muiStyled('img')(({ theme }) => ({
  maxWidth: '10rem',

  [theme.breakpoints.down('xl')]: {
    maxWidth: '10rem',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '8rem',
  },
}))

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  legalName_pronunciation: '',
  havePreferred: false,
  preferredName: '',
  preferredName_pronunciation: '',
  timezone: { code: '', label: '', phone: '' },
  mobile: '',
  phone: '',
  jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
  experience: '',
  resume: null,
  specialties: '',
}

/* TODO: guestGuard false로 수정하기 */
const PersonalInfoPro = () => {
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const languageList = getGloLanguage()

  // ** states
  const [step, setStep] = useState<1 | 2>(2)

  // ** Hooks
  const auth = useAuth()

  const {
    control,
    setError,
    handleSubmit,
    clearErrors,
    getValues,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<PersonalInfo>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(profileSchema),
  })

  const {
    fields: jobInfoFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'jobInfo',
  })

  const onSubmit = (data: PersonalInfo) => {
    // const { email, password } = data
  }
  console.log(getValues())

  function onChangeLanguage(
    id: string,
    value: any,
    item: 'jobType' | 'role' | 'source' | 'target',
  ) {
    console.log(id, value)
    const filtered = jobInfoFields.filter(f => f.id! === id)[0]
    const index = jobInfoFields.findIndex(f => f.id! === id)
    const newVal = { ...filtered, [item]: value }
    update(index, newVal)
  }
  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box
          sx={{
            maxWidth: '30rem',
            padding: '8rem',
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden
        >
          <Illustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-register-multi-steps-illustration.png`}
          />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: 7,
            display: 'flex',
            alignItems: 'center',
            padding: '50px 50px',
            height: '100%',
          }}
        >
          <BoxWrapper>
            <Box
              sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <TypographyStyled variant='h2'>01</TypographyStyled>
                <Typography>Personal Information</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <TypographyStyled variant='h2'>02</TypographyStyled>
                <Typography>Application</Typography>
              </Box>
            </Box>

            <form
              noValidate
              autoComplete='off'
              // onSubmit={handleSubmit(onSubmit)}
            >
              {step === 1 ? (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name='firstName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.firstName)}
                            placeholder='First name*'
                          />
                        )}
                      />
                      {errors.firstName && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.firstName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name='middleName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.middleName)}
                            placeholder='Middle name'
                          />
                        )}
                      />
                      {errors.middleName && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.middleName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name='lastName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.lastName)}
                            placeholder='Last name*'
                          />
                        )}
                      />
                      {errors.lastName && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.lastName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='legalName_pronunciation'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 200 }}
                            error={Boolean(errors.legalName_pronunciation)}
                            placeholder='Pronunciation'
                          />
                        )}
                      />
                      {errors.legalName_pronunciation && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.legalName_pronunciation.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='pronounce'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <>
                            <InputLabel id='legalName_pronounce'>
                              Pronounce
                            </InputLabel>
                            <Select
                              label='legalName_pronounce'
                              value={value}
                              placeholder='Pronounce'
                              onBlur={onBlur}
                              onChange={onChange}
                            >
                              {Pronunciation.map((item, idx) => (
                                <MenuItem value={item.value} key={idx}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </>
                        )}
                      />
                      {errors.pronounce && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.pronounce.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Controller
                    name='havePreferred'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={value || false}
                            onChange={onChange}
                            onBlur={onBlur}
                            checked={value || false}
                          />
                        }
                        label='I have my preferred name.'
                      />
                    )}
                  />
                  {getValues('havePreferred') && (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                      <FormControl sx={{ mb: 2 }} fullWidth>
                        <Controller
                          name='preferredName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              inputProps={{ maxLength: 200 }}
                              error={Boolean(errors.preferredName)}
                              placeholder='Preferred name'
                            />
                          )}
                        />
                        {errors.preferredName && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.preferredName.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl sx={{ mb: 2 }} fullWidth>
                        <Controller
                          name='preferredName_pronunciation'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              inputProps={{ maxLength: 200 }}
                              error={Boolean(
                                errors.preferredName_pronunciation,
                              )}
                              placeholder='Pronunciation'
                            />
                          )}
                        />
                        {errors.preferredName_pronunciation && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.preferredName_pronunciation.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  )}

                  <Divider />
                  {/* <Autocompletet /> */}
                  <Box>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='timezone'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            options={countries as CountryType[]}
                            onChange={(e, v) => onChange(v)}
                            renderOption={(props, option) => (
                              <Box component='li' {...props}>
                                {option.label} ({option.code}) +{option.phone}
                              </Box>
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Time zone*'
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password',
                                }}
                              />
                            )}
                          />
                        )}
                      />
                      {errors.pronounce && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.pronounce.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  {/* phone  */}
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='mobile'
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.mobile)}
                            placeholder='Mobile phone'
                            InputProps={{
                              type: 'number',
                              startAdornment: (
                                <InputAdornment position='start'>
                                  {getValues('timezone').phone &&
                                    '+' + getValues('timezone').phone}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.mobile && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.mobile.message}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='phone'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.phone)}
                            placeholder='Telephone'
                            InputProps={{
                              type: 'number',
                              startAdornment: (
                                <InputAdornment position='start'>
                                  {getValues('timezone').phone &&
                                    '+' + getValues('timezone').phone}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.phone && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.phone.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {/* JobInfos */}
                  {jobInfoFields?.map((item, idx) => {
                    return (
                      <Box key={item.id}>
                        {/* job type & role */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <>
                              <InputLabel id='jobType'>Job type*</InputLabel>
                              <Select
                                label='Job type*'
                                value={item.jobType}
                                placeholder='Job type *'
                                onChange={e =>
                                  onChangeLanguage(
                                    item.id,
                                    e.target.value,
                                    'jobType',
                                  )
                                }
                              >
                                {JobList.map((item, idx) => (
                                  <MenuItem value={item.value} key={idx}>
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                            {/* @ts-ignore */}
                            {errors?.jobInfo[idx]?.jobType && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors?.jobInfo[idx]?.jobType?.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl sx={{ mb: 4 }} fullWidth>
                            <Controller
                              name='pronounce'
                              control={control}
                              rules={{ required: true }}
                              render={({
                                field: { value, onChange, onBlur },
                              }) => (
                                <>
                                  <InputLabel id='legalName_pronounce'>
                                    Pronounce
                                  </InputLabel>
                                  <Select
                                    label='legalName_pronounce'
                                    value={value}
                                    placeholder='Pronounce'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                  >
                                    {Pronunciation.map((item, idx) => (
                                      <MenuItem value={item.value} key={idx}>
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </>
                              )}
                            />
                            {errors.pronounce && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.pronounce.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                        {/* languages */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name='timezone'
                              control={control}
                              rules={{ required: true }}
                              render={({
                                field: { value, onChange, onBlur },
                              }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  options={countries as CountryType[]}
                                  onChange={(e, v) => onChange(v)}
                                  renderOption={(props, option) => (
                                    <Box component='li' {...props}>
                                      {option.label} ({option.code}) +
                                      {option.phone}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Time zone*'
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />
                            {errors.pronounce && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.pronounce.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name='timezone'
                              control={control}
                              rules={{ required: true }}
                              render={({
                                field: { value, onChange, onBlur },
                              }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  options={countries as CountryType[]}
                                  onChange={(e, v) => onChange(v)}
                                  renderOption={(props, option) => (
                                    <Box component='li' {...props}>
                                      {option.label} ({option.code}) +
                                      {option.phone}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Time zone*'
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />
                            {errors.pronounce && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.pronounce.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}

                  <Divider />
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  type='button'
                  variant='contained'
                  disabled={step === 1}
                  onClick={() => setStep(1)}
                  sx={{ mb: 7 }}
                >
                  &larr; Previous
                </Button>
                {step === 2 ? (
                  <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    sx={{ mb: 7 }}
                    disabled={
                      !(
                        dirtyFields.firstName &&
                        dirtyFields.lastName &&
                        dirtyFields.timezone &&
                        isEmpty(errors)
                      )
                    }
                  >
                    Get started &rarr;
                  </Button>
                ) : (
                  <Button
                    size='large'
                    type='button'
                    variant='contained'
                    sx={{ mb: 7 }}
                    disabled={
                      !(
                        dirtyFields.firstName &&
                        dirtyFields.lastName &&
                        dirtyFields.timezone &&
                        isEmpty(errors)
                      )
                    }
                    onClick={() => setStep(2)}
                  >
                    Next &rarr;
                  </Button>
                )}
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

PersonalInfoPro.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

PersonalInfoPro.guestGuard = true

export default PersonalInfoPro
