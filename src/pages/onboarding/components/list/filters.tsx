import { Card, CardHeader, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import Icon from '@src/@core/components/icon'
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'

import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { JobList } from '@src/shared/const/job/jobs'
import {
  OnboardingListRolePair,
  ProRolePair,
} from '@src/shared/const/role/roles'
import { TestStatus } from '@src/shared/const/status/statuses'
import { ExperiencedYearsForFilter } from '@src/shared/const/experienced-years'

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
} from 'react'
import _ from 'lodash'

import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import { FilterType } from '@src/types/onboarding/list'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import PushPinIcon from '@mui/icons-material/PushPin';
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'

export type CardProps = {
  dropdownClose: boolean
}

type Props = {
  onboardingProListCount: number
  control: Control<FilterType, any>
  handleSubmit: UseFormHandleSubmit<FilterType>
  onSubmit: (data: FilterType) => void
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
  timezoneList: {
    id: number;
    code: string;
    label: string;
    pinned: boolean;
  }[]
  timezone: {
    offset: number;
    offsetFormatted: string;
    timezone: string;
    timezoneCode: string;
  }[]
  setTimezoneList: Dispatch<SetStateAction<{
    id: number;
    code: string;
    label: string;
    pinned: boolean;
  }[]>>
  handleFilterStateChange: (
    panel: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  expanded: string | false
}

export default function Filters({
  onboardingProListCount,
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
  timezoneList,
  timezone,
  setTimezoneList,
  expanded,
  handleFilterStateChange,
}: Props) {
  const [inputStyle, setInputStyle] = useState<boolean>(true)
  const [onFocused, setOnFocused] = useState<boolean>(false)

  const [sourceMultiple, setSourceMultiple] = useState<boolean>(false)
  const [targetMultiple, setTargetMultiple] = useState<boolean>(false)

  const onFocusSearchInput = () => {
    setOnFocused(true)
  }

  const handlePin = (option: {
    id: number;
    code: string;
    label: string;
    pinned: boolean;
  }) => {
    const newOptions = timezoneList.map((opt) =>
        opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt
    );
    setTimezoneList(newOptions);
    localStorage.setItem('timezonePinnedOptions', JSON.stringify(newOptions)); 
  }

  const sortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id; // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1; // 핀 상태에 따라 정렬
  });

  const lastPinnedIndex = timezoneList.reduce((lastIndex, option, index) => option.pinned ? index : lastIndex, -1);

  return (
    <>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: '16px 16px 0 0',
            paddingBottom: 0,
            // boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.2)',
            paddingLeft: '24px',
          }}
        >
          <Box
            sx={{
              padding: '12px 20px 12px 20px',
            }}
          >
            <Typography variant='h6'>
              Onboarding list ({onboardingProListCount.toLocaleString()})
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              xs={12}
              spacing={6}
              rowSpacing={4}
              sx={{ padding: '0 20px 20px' }}
            >
              <Grid item xs={3} sx={{ height: 40 }}>
                <Box className='filterFormAutoCompleteV2'>
                  <Controller
                    control={control}
                    name='jobType'
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        sx={{ height: 40 }}
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

                          if (item.length) {
                            const arr: {
                              label: string
                              value: string
                              jobType: string[]
                            }[] = []
                            item.map((data, idx) => {
                              const jobTypeValue = data?.value
                              // console.log(jobTypeValue)

                              /* @ts-ignore */
                              const res = OnboardingListRolePair.filter(
                                value => value.jobType.includes(jobTypeValue),
                              )

                              arr.push(...res)

                              trigger('role')
                            })
                            setRoleOptions(arr)
                          } else {
                            setRoleOptions(OnboardingListRolePair)
                          }
                        }}
                        value={value}
                        disableCloseOnSelect
                        limitTags={1}
                        options={jobTypeOptions}
                        id='jobType'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField {...params} autoComplete='off' label='Job type' />
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
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box className='filterFormAutoCompleteV2'>
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
                            // console.log(item)

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
                          <TextField {...params} autoComplete='off' label='Role' />
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
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box className='filterFormAutoCompleteV2'>
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
                          if (targetMultiple) {
                            setSourceMultiple(false)
                            if (item.length > 1) {
                              item[0] = item[1]
                              item.splice(1)
                            }
                          } else {
                            if (item.length > 1) setSourceMultiple(true)
                            else setSourceMultiple(false)
                          }
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
                          <TextField {...params} autoComplete='off' label='Source' />
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
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box className='filterFormAutoCompleteV2'>
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
                          if (sourceMultiple) {
                            setTargetMultiple(false)
                            if (item.length > 1) {
                              item[0] = item[1]
                              item.splice(1)
                            }
                          } else {
                            if (item.length > 1) setTargetMultiple(true)
                            else setTargetMultiple(false)
                          }
                          onChange(item)
                        }}
                        value={value}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.value === newValue.value
                        }}
                        disableCloseOnSelect
                        limitTags={1}
                        options={_.uniqBy(languageList, 'value')}
                        id='target'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField {...params} autoComplete='off' label='Target' />
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
                </Box>
              </Grid>
              <Grid item xs={2.4}>
                <Box className='filterFormAutoCompleteV2'>
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
                        options={ExperiencedYearsForFilter}
                        id='experience'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField {...params} autoComplete='off' label='Experience' />
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
                </Box>
              </Grid>
              <Grid item xs={2.4}>
                <Box className='filterFormAutoCompleteV2'>
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
                          <TextField {...params} autoComplete='off' label='Test status' />
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
                </Box>
              </Grid>
              <Grid item xs={2.4}>
                <Box className='filterFormAutoCompleteV2'>
                  <Controller
                    control={control}
                    name='timezone'
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
                        // options={timezoneList.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))}
                        options={sortedOptions}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.id === newValue.id
                        }}
                        disableCloseOnSelect
                        limitTags={1}
                        id='timezone'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField {...params} autoComplete='off' label={`Pro's timeonze`} />
                        )}
                        renderOption={(props, option, state) => (
                          <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: state.index === lastPinnedIndex ? '1px solid #E9EAEC' : 'none' }}>
                            <Checkbox checked={state.selected} sx={{ mr: 2 }} />
                            <Typography noWrap sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {/* {option.label} */}
                              {timeZoneFormatter(option, timezone)}
                            </Typography>
                            <IconButton
                              onClick={(event) => {
                                  event.stopPropagation(); // 드롭다운이 닫히는 것 방지
                                  handlePin(option)
                              }}
                              size="small"
                              style={{ color: option.pinned ? '#FFAF66' : undefined }} 
                          >
                              <PushPinIcon />
                            </IconButton>
                          </Box>
                        )}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs>
                <Box className='filterFormAutoCompleteV2'>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name='search'
                      render={({ field: { onChange, value } }) => (
                        <>
                          <InputLabel
                            sx={{ fontSize: 14, height: 40 }}
                            htmlFor='icons-adornment-password'>
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
                                <Icon fontSize={24} icon={'mdi:magnify'} />
                              </InputAdornment>
                            }
                          />
                        </>
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display='flex' gap='15px'>
                  <Button
                    fullWidth
                    variant='outlined'
                    size='medium'
                    color='secondary'
                    type='button'
                    onClick={onClickResetButton}
                  >
                    Reset
                  </Button>
                  <Button fullWidth variant='contained' size='medium' type='submit'>
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Grid>
    </>
  )
}

export const AutoCompleteComponent = styled(Card)<CardProps>(
  ({ theme, dropdownClose }) => ({
    '& .MuiAutocomplete-inputRoot': {
      height: '40px;',
      flexWrap: dropdownClose ? 'wrap;' : 'noWrap;',
    },
  }),
)
