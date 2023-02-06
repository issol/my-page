import { Card, CardHeader, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {
  JobList,
  RolePair,
  DefaultRolePair,
  ExperiencedYears,
  TestStatus,
} from 'src/shared/const/personalInfo'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import _ from 'lodash'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import { FilterType } from '../..'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
type CardProps = {
  dropdownClose: boolean
}

type Props = {
  control: any
  handleSubmit: any
  onSubmit: (data: any) => void
  onClickResetButton: () => void
  trigger: UseFormTrigger<FilterType>
  setJobTypeOptions: Dispatch<
    SetStateAction<
      {
        label: string
        value: string
      }[]
    >
  >
  setRoleOptions: Dispatch<
    SetStateAction<
      {
        label: string
        value: string
        jobType: string[]
      }[]
    >
  >
  jobTypeOptions: {
    label: string
    value: string
  }[]
  roleOptions: {
    label: string
    value: string
    jobType: string[]
  }[]
  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
}

export default function Filters({
  control,
  handleSubmit,
  onSubmit,
  onClickResetButton,
  trigger,
  setJobTypeOptions,
  setRoleOptions,
  jobTypeOptions,
  roleOptions,
  languageList,
}: Props) {
  const [inputStyle, setInputStyle] = useState<boolean>(true)
  const [onFocused, setOnFocused] = useState<boolean>(false)

  const onFocusSearchInput = () => {
    setOnFocused(true)
  }

  return (
    <>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AutoCompleteComponent dropdownClose={inputStyle}>
            <CardHeader title='Search Filters' />
            <Grid
              container
              xs={12}
              spacing={6}
              rowSpacing={4}
              sx={{ padding: '0 20px 20px' }}
            >
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='jobType'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                        console.log(item)
                        if (item.length) {
                          const arr: {
                            label: string
                            value: string
                            jobType: string[]
                          }[] = []
                          item.map((data, idx) => {
                            const jobTypeValue = data?.value
                            /* @ts-ignore */
                            const rolePair = RolePair[jobTypeValue]
                            arr.push(...rolePair)

                            trigger('role')
                          })
                          setRoleOptions(arr)
                        } else {
                          setRoleOptions(DefaultRolePair)
                        }
                      }}
                      value={value}
                      disableCloseOnSelect
                      limitTags={1}
                      options={jobTypeOptions}
                      id='jobType'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Job type' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='role'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      onChange={(
                        event,
                        item: {
                          label: string
                          value: string
                          jobType: string[]
                        }[],
                      ) => {
                        onChange(item)

                        if (item.length) {
                          const arr: {
                            label: string
                            value: string
                          }[] = []
                          item.map((data, idx) => {
                            data.jobType.map(value => {
                              const jobType = JobList.filter(
                                data => data.value === value,
                              )
                              arr.push(...jobType)
                              trigger('jobType')
                            })
                          })
                          setJobTypeOptions(_.uniqBy(arr, 'value'))
                        } else {
                          setJobTypeOptions(JobList)
                        }
                      }}
                      value={value}
                      disableCloseOnSelect
                      limitTags={1}
                      options={roleOptions}
                      id='role'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Role' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='source'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={_.uniqBy(languageList, 'value')}
                      id='source'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Source' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='target'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={_.uniqBy(languageList, 'value')}
                      // getOptionDisabled={option => option.disabled}
                      id='target'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Target'
                          // placeholder='Favorites'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='experience'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={ExperiencedYears}
                      id='experience'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Experience' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='testStatus'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={TestStatus}
                      id='testStatus'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Test status' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    control={control}
                    name='search'
                    render={({ field: { onChange, value } }) => (
                      <>
                        <InputLabel htmlFor='icons-adornment-password'>
                          {onFocused
                            ? 'Search Pros'
                            : 'Search the legal name and email'}
                        </InputLabel>
                        <OutlinedInput
                          label={
                            onFocused
                              ? 'Search Pros'
                              : 'Search the legal name and email'
                          }
                          value={value}
                          id='icons-adornment-password'
                          onFocus={onFocusSearchInput}
                          onBlur={() => setOnFocused(false)}
                          onChange={onChange}
                          type={'text'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <Icon fontSize={20} icon={'mdi:magnify'} />
                            </InputAdornment>
                          }
                        />
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='flex-end' gap='15px'>
                  <Button
                    variant='outlined'
                    size='medium'
                    color='secondary'
                    type='button'
                    onClick={onClickResetButton}
                  >
                    Reset
                  </Button>
                  <Button variant='contained' size='medium' type='submit'>
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </AutoCompleteComponent>
        </form>
      </Grid>
    </>
  )
}

const AutoCompleteComponent = styled(Card)<CardProps>(
  ({ theme, dropdownClose }) => ({
    '& .MuiAutocomplete-inputRoot': {
      height: !dropdownClose && '56px;',
      flexWrap: dropdownClose ? 'wrap;' : 'noWrap;',
    },
  }),
)
