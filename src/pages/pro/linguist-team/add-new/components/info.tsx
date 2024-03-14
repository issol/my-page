import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import { Icon } from '@iconify/react'
import {
  Box,
  Typography,
  Grid,
  Button,
  Checkbox,
  TextField,
  FormControl,
  Autocomplete,
} from '@mui/material'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import _ from 'lodash'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'

type Props = {
  handleNext: (data: LinguistTeamFormType) => void
  control: Control<LinguistTeamFormType, any>
  handleSubmit: UseFormHandleSubmit<LinguistTeamFormType, undefined>
  isSubmitted: boolean
  clientList: Array<{
    clientId: number
    name: string
  }>
  languageList: Array<{ value: string; label: GloLanguageEnum }>
  serviceTypeList: Array<{ value: number; label: string }>
  getValues: UseFormGetValues<LinguistTeamFormType>
  trigger: UseFormTrigger<LinguistTeamFormType>
}

const LinguistTeamInfoForm = ({
  handleNext,
  control,
  handleSubmit,

  isSubmitted,
  clientList,
  languageList,
  serviceTypeList,
  getValues,
  trigger,
}: Props) => {
  return (
    <form onSubmit={handleSubmit(handleNext)}>
      <Box
        sx={{
          padding: '32px 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            padding: '0px 8px',
          }}
        >
          <Typography fontSize={20} fontWeight={500}>
            Linguist team info
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',

              gap: '4px',
              marginLeft: '-24px',
              maxWidth: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Controller
                name='isPrivate'
                control={control}
                render={({ field }) => {
                  return (
                    <Checkbox
                      sx={{ paddingRight: 0 }}
                      checked={field.value === '1' ? true : false}
                      onChange={e =>
                        field.onChange(e.target.checked ? '1' : '0')
                      }
                    />
                  )
                }}
              />

              <Typography fontSize={14} fontWeight={400}>
                Private team
              </Typography>
              <Icon icon='mdi:lock' color='#8D8E9A' fontSize={20} />
            </Box>
            <Typography fontSize={12} fontWeight={400} color='#8D8E9A'>
              Only you will be able to see this team.
            </Typography>
          </Box>

          <Grid container spacing={6} rowSpacing={4} mt={4}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Team name&nbsp;
                  <Typography color='#666CFF' component='span'>
                    *
                  </Typography>
                </Typography>
                <FormControl fullWidth className='filterFormControl'>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field, formState }) => {
                      return (
                        <TextField
                          value={field.value}
                          error={
                            !!formState.errors.name && formState.isSubmitted
                          }
                          helperText={
                            formState.isSubmitted
                              ? formState.errors.name?.message
                              : ''
                          }
                          sx={{
                            height: '46px',
                          }}
                          inputProps={{
                            style: {
                              height: '46px',
                              padding: '0 14px',
                            },
                          }}
                          onChange={e => {
                            if (e.target.value) {
                              if (e.target.value.length <= 50) field.onChange(e)
                            } else {
                              field.onChange(null)
                            }
                          }}
                        />
                      )
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Client
                </Typography>
                <Box className='filterFormSoloAutoComplete'>
                  <Controller
                    name='clientId'
                    control={control}
                    render={({ field, formState }) => {
                      return (
                        <Autocomplete
                          fullWidth
                          options={clientList}
                          value={
                            clientList.find(
                              value => value.clientId === field.value,
                            ) ?? null
                          }
                          getOptionLabel={option => option.name}
                          onChange={(e, v) => {
                            console.log(v)

                            if (v) {
                              field.onChange(v.clientId)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          renderInput={params => (
                            <TextField {...params} autoComplete='off' />
                          )}
                        />
                      )
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  // gap: '8px',
                }}
              >
                <Box sx={{ display: 'flex', gap: '4px' }}>
                  <Typography fontSize={14} fontWeight={600}>
                    Service type
                  </Typography>
                  <Typography color='#666CFF' fontSize={14}>
                    *
                  </Typography>
                </Box>

                <Box className='filterFormSoloAutoComplete'>
                  <Controller
                    name='serviceTypeId'
                    control={control}
                    render={({ field, formState }) => {
                      return (
                        <Autocomplete
                          fullWidth
                          options={serviceTypeList}
                          value={serviceTypeList.find(
                            (item: { value: number; label: string }) =>
                              field.value === item.value,
                          )}
                          onChange={(e, v) => {
                            if (v) {
                              field.onChange(v.value)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              autoComplete='off'
                              error={
                                !!formState.errors.serviceTypeId &&
                                formState.isSubmitted
                              }
                              helperText={
                                formState.isSubmitted
                                  ? formState.errors.serviceTypeId?.message
                                  : ''
                              }
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Box sx={{ display: 'flex', gap: '4px' }}>
                  <Typography fontSize={14} fontWeight={600}>
                    Source language
                  </Typography>
                  <Typography color='#666CFF' fontSize={14}>
                    *
                  </Typography>
                </Box>
                <Box className='filterFormSoloAutoComplete'>
                  <Controller
                    name='sourceLanguage'
                    control={control}
                    render={({ field, formState }) => {
                      return (
                        <Autocomplete
                          fullWidth
                          options={_.uniqBy(languageList, 'value')}
                          getOptionLabel={option => option.label}
                          value={
                            languageList.find(
                              (item: {
                                value: string
                                label: GloLanguageEnum
                              }) => field.value === item.value,
                            ) ?? null
                          }
                          onChange={(e, v) => {
                            if (v) {
                              field.onChange(v.value)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              autoComplete='off'
                              error={
                                !!formState.errors.sourceLanguage &&
                                formState.isSubmitted
                              }
                              helperText={
                                formState.isSubmitted
                                  ? formState.errors.sourceLanguage?.message
                                  : ''
                              }
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Box sx={{ display: 'flex', gap: '4px' }}>
                  <Typography fontSize={14} fontWeight={600}>
                    Target language
                  </Typography>
                  <Typography color='#666CFF' fontSize={14}>
                    *
                  </Typography>
                </Box>
                <Box className='filterFormSoloAutoComplete'>
                  <Controller
                    name='targetLanguage'
                    control={control}
                    render={({ field, formState }) => {
                      return (
                        <Autocomplete
                          fullWidth
                          options={_.uniqBy(languageList, 'value')}
                          getOptionLabel={option => option.label}
                          value={
                            languageList.find(
                              (item: {
                                value: string
                                label: GloLanguageEnum
                              }) => field.value === item.value,
                            ) ?? null
                          }
                          onChange={(e, v) => {
                            if (v) {
                              field.onChange(v.value)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              autoComplete='off'
                              error={
                                !!formState.errors.targetLanguage &&
                                formState.isSubmitted
                              }
                              helperText={
                                formState.isSubmitted
                                  ? formState.errors.targetLanguage?.message
                                  : ''
                              }
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Description
                </Typography>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        multiline
                        maxRows={3}
                        rows={3}
                        value={field.value}
                        onChange={e => {
                          if (e.target.value) {
                            if (e.target.value.length <= 50) {
                              field.onChange(e)
                            }
                          } else {
                            field.onChange(null)
                          }
                          trigger('description')
                        }}
                      />
                    )
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography color='#888' fontSize={12} fontWeight={400}>
                    {getValues('description')
                      ? getValues('description')?.length
                      : 0}
                    /50
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant='contained'
                  sx={{ width: '181px' }}
                  type='submit'
                  // onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  )
}

export default LinguistTeamInfoForm
