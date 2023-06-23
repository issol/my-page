import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { countries } from '@src/@fake-db/autocomplete'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { getTypeList } from '@src/shared/transformer/type.transformer'
import { CompanyInfoFormType, CompanyInfoType } from '@src/types/company/info'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  companyInfo: CompanyInfoType
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  control: Control<
    Omit<CompanyInfoFormType, 'billingPlan' | 'logo' | 'address'>,
    any
  >
  ceoFields: FieldArrayWithId<
    Omit<CompanyInfoFormType, 'billingPlan' | 'logo'>,
    'ceo',
    'id'
  >[]
  watch: UseFormWatch<
    Omit<CompanyInfoFormType, 'billingPlan' | 'logo' | 'address'>
  >
  onClickCancel: () => void
  onClickSave: () => void
  onClickAddCeo: () => void
  onClickDeleteCeo: (id: string) => void
  isValid: boolean
}

const CompanyInfoOverview = ({
  companyInfo,
  edit,
  setEdit,
  control,
  ceoFields,
  watch,
  onClickCancel,
  onClickSave,
  onClickAddCeo,
  onClickDeleteCeo,
  isValid,
}: Props) => {
  const country = getTypeList('CountryCode')
  return (
    <Card sx={{ padding: '24px' }}>
      {edit ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box sx={{ display: 'flex', gap: '24px' }}>
            <Card
              sx={{
                padding: '4px 5px',
                width: '120px',
                height: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100px',
                  height: '86.85px',
                  padding: '10px',
                }}
              >
                <img
                  src={
                    companyInfo?.logo ??
                    '/images/company/default-company-logo.svg'
                  }
                  alt=''
                  style={{
                    width: '80px',
                    height: '66.85px',
                  }}
                />
              </Box>
            </Card>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',

                gap: '20px',
                width: '100%',

                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button variant='contained' sx={{ width: '173px' }}>
                  Upload new photo
                </Button>
                <Button variant='outlined'>Delete</Button>
              </Box>
              <Typography variant='body2'>
                Allowed PNG or JPEG. Max size of 800K.
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ width: '100%' }}>
            <Controller
              name='name'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Company name*'
                  value={value || ''}
                  onChange={onChange}
                />
              )}
            />
          </Box>
          <Box>
            <Typography variant='h6'>CEO</Typography>
            <Box sx={{ mt: '20px' }}>
              {ceoFields.map((value, idx) => {
                return (
                  <Grid key={uuidv4()} container xs={12} spacing={4} mb='16px'>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          {(idx + 1).toString().padStart(2, '0')}.
                        </Typography>
                        {ceoFields.length > 1 && (
                          <IconButton
                            onClick={() => onClickDeleteCeo(value.id)}
                          >
                            <Icon icon='mdi:trash-outline' />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name={`ceo.${idx}.firstName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            value={value || ''}
                            onChange={onChange}
                            label='First name'
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <Controller
                        name={`ceo.${idx}.middleName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            value={value || ''}
                            onChange={onChange}
                            label='Middle name'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name={`ceo.${idx}.lastName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            value={value || ''}
                            onChange={onChange}
                            label='Last name'
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )
              })}
              <Button
                variant='contained'
                disabled={ceoFields.length >= 2}
                onClick={onClickAddCeo}
                sx={{ p: 0.7, minWidth: 26 }}
              >
                <Icon icon='material-symbols:add' fontSize={18} />
              </Button>
            </Box>
            <Divider sx={{ mt: '20px !important' }} />
            <Box>
              <Typography variant='h6'>Company details</Typography>
              <Grid container xs={12} mt='20px' spacing={4}>
                <Grid item xs={6}>
                  <Controller
                    name='headquarter'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={country}
                        onChange={(e, v) => onChange(v)}
                        disableClearable
                        value={
                          !value
                            ? { value: '', label: '' }
                            : country.filter(
                                item => item.value === value.value,
                              )[0]
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Headquarter'
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
                  <Controller
                    name='timezone'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        fullWidth
                        value={value || { code: '', label: '', phone: '' }}
                        options={countries as CountryType[]}
                        onChange={(e, v) => {
                          console.log(value)

                          if (!v) onChange(null)
                          else onChange(v)
                        }}
                        renderOption={(props, option) => (
                          <Box component='li' {...props}>
                            {getGmtTimeEng(option.code)}
                          </Box>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Timezone*'
                            // error={Boolean(errors.dueTimezone)}
                          />
                        )}
                        getOptionLabel={option =>
                          option.code === '' ? '' : getGmtTimeEng(option.code)
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='registrationNumber'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='Company registration number'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='Company e-mail'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        placeholder={
                          !watch('timezone')?.phone
                            ? `+ 1) 012 345 6789`
                            : `012 345 6789`
                        }
                        onChange={e => {
                          if (isInvalidPhoneNumber(e.target.value)) return
                          onChange(e)
                        }}
                        InputProps={{
                          startAdornment: watch('timezone') &&
                            watch('timezone').phone && (
                              <InputAdornment position='start'>
                                {'+' + watch('timezone').phone}
                              </InputAdornment>
                            ),
                          inputProps: {
                            maxLength: 50,
                          },
                        }}
                        label='Telephone'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='fax'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        placeholder={
                          !watch('timezone')?.phone
                            ? `+ 1) 012 345 6789`
                            : `012 345 6789`
                        }
                        onChange={e => {
                          if (isInvalidPhoneNumber(e.target.value)) return
                          onChange(e)
                        }}
                        InputProps={{
                          startAdornment: watch('timezone') &&
                            watch('timezone')?.phone && (
                              <InputAdornment position='start'>
                                {'+' + watch('timezone').phone}
                              </InputAdornment>
                            ),
                          inputProps: {
                            maxLength: 50,
                          },
                        }}
                        label='Fax'
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                mt: '24px',
              }}
            >
              <Button variant='outlined' onClick={onClickCancel}>
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={onClickSave}
                disabled={!isValid}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6'>Company information</Typography>

            <IconButton
              onClick={() => setEdit(true)}
              // disabled={invoiceInfo.invoiceStatus === 'Paid'}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            mt='20px'
          >
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:crown-outline'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  CEO:
                </Typography>
                <Typography variant='subtitle2' fontSize={16} fontWeight={400}>
                  {companyInfo.ceo && companyInfo.ceo.length > 0
                    ? companyInfo?.ceo?.map((value, index) => {
                        const lastIndex = companyInfo.ceo!.length - 1
                        return (
                          <>
                            {getLegalName({ ...value })}
                            {lastIndex !== index && ', '}
                          </>
                        )
                      })
                    : '-'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='pajamas:building'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Headquarter:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.headquarter ?? '-'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:earth'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Time zone:
                </Typography>
                <Typography variant='subtitle2' fontSize={16} fontWeight={400}>
                  {getGmtTimeEng(companyInfo.timezone?.code)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:playlist-check'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Company registration number:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.registrationNumber ?? '-'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:email-outline'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Company e-mail:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.email ?? '-'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:phone'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Business number:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.phone
                    ? `+${companyInfo.timezone.phone}) ${companyInfo.phone}`
                    : '-'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='material-symbols:fax-outline-rounded'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Fax:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.fax
                    ? `+${companyInfo.timezone.phone}) ${companyInfo.fax}`
                    : '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Card>
  )
}

export default CompanyInfoOverview
