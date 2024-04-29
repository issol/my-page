import { Card, Grid, IconButton, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import Icon from '@src/@core/components/icon'
import {
  Controller,
  Control,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'

import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { JobList } from '@src/shared/const/job/jobs'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { ProStatus, TestStatus } from '@src/shared/const/status/statuses'
import { ExperiencedYearsForFilter } from '@src/shared/const/experienced-years'
import PushPinIcon from '@mui/icons-material/PushPin'

import {
  useState,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useMemo,
} from 'react'
import _ from 'lodash'

import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'

import { FilterType } from '@src/types/onboarding/list'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import { ProFilterType } from '@src/types/pro/list'
import { useGetClientList } from '@src/queries/client.query'
import { useGetSimpleClientList } from '@src/queries/common.query'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { setTimezonePin } from '@src/shared/auth/storage'

export type CardProps = {
  dropdownClose: boolean
  modal?: boolean
}

type Props = {
  control: Control<ProFilterType, any>
  handleSubmit: UseFormHandleSubmit<ProFilterType>
  onSubmit: (data: ProFilterType) => void
  onClickResetButton: () => void
  trigger: UseFormTrigger<ProFilterType>
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
  handleFilterStateChange: (
    panel: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  expanded: string | false
  proListCount: number
  timezoneList: {
    id: number
    code: string
    label: string
    pinned: boolean
  }[]
  timezone: {
    offset: number
    offsetFormatted: string
    timezone: string
    timezoneCode: string
  }[]
  setTimezoneList: Dispatch<
    SetStateAction<
      {
        id: number
        code: string
        label: string
        pinned: boolean
      }[]
    >
  >
}

const ProListFilters = ({
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
  expanded,
  handleFilterStateChange,
  proListCount,
  timezoneList,
  timezone,
  setTimezoneList,
}: Props) => {
  const [inputStyle, setInputStyle] = useState<boolean>(true)
  const [onFocused, setOnFocused] = useState<boolean>(false)

  const [sourceMultiple, setSourceMultiple] = useState<boolean>(false)
  const [targetMultiple, setTargetMultiple] = useState<boolean>(false)

  const onFocusSearchInput = () => {
    setOnFocused(true)
  }

  const { data: clientList } = useGetSimpleClientList()

  const handleTimezonePin = (option: {
    id: number
    code: string
    label: string
    pinned: boolean
  }) => {
    const newOptions = timezoneList.map(opt =>
      opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt,
    )
    setTimezoneList(newOptions)
    setTimezonePin(newOptions)
  }

  const pinSortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1 // 핀 상태에 따라 정렬
  })

  return (
    <Card sx={{ padding: '24px', borderRadius: '16px 16px 0 0' }}>
      <Typography variant='h6' sx={{ mb: '20px' }}>
        Pros ({proListCount.toLocaleString()})
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container xs={12} spacing={6} rowSpacing={4}>
          <Grid item xs={3}>
            <Box className='filterFormAutoCompleteV2'>
              <Controller
                control={control}
                name='status'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    disableCloseOnSelect
                    limitTags={1}
                    options={ProStatus}
                    id='status'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Status'
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
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box className='filterFormAutoCompleteV2'>
              <Controller
                control={control}
                name='clientId'
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
                      return option.clientId === newValue.clientId
                    }}
                    disableCloseOnSelect
                    limitTags={1}
                    options={clientList || []}
                    id='clients'
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Clients'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.name}
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
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Source'
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
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Target'
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
                    options={pinSortedOptions}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.id === newValue.id
                    }}
                    disableCloseOnSelect
                    limitTags={1}
                    id='timezone'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label={`Pro's timezone`}
                      />
                    )}
                    renderOption={(props, option, state) => (
                      <Box
                        component='li'
                        {...props}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Checkbox checked={state.selected} sx={{ mr: 2 }} />
                        <Typography
                          noWrap
                          sx={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {timeZoneFormatter(option, timezone)}
                        </Typography>
                        <IconButton
                          onClick={event => {
                            event.stopPropagation() // 드롭다운이 닫히는 것 방지
                            handleTimezonePin(option)
                          }}
                          size='small'
                          style={{
                            color: option.pinned ? '#FFAF66' : undefined,
                          }}
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
          <Grid item xs={2.4}>
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
                            // trigger('jobType')
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
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Years of experience'
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
            </Box>
          </Grid>
          {/* <Grid item xs={2.5}>
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
                      <TextField
                        {...params}
                        autoComplete='off'
                        label={`Pro's timezone`}
                      />
                    )}
                    renderOption={(props, option, state) => (
                      <Box
                        component='li'
                        {...props}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            state.index === lastPinnedIndex
                              ? '1px solid #E9EAEC'
                              : 'none',
                        }}
                      >
                        <Checkbox checked={state.selected} sx={{ mr: 2 }} />
                        <Typography
                          noWrap
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {timeZoneFormatter(option, timezone)}
                        </Typography>
                        <IconButton
                          onClick={event => {
                            event.stopPropagation() // 드롭다운이 닫히는 것 방지
                            handlePin(option)
                          }}
                          size='small'
                          style={{
                            color: option.pinned ? '#FFAF66' : undefined,
                          }}
                        >
                          <PushPinIcon />
                        </IconButton>
                      </Box>
                    )}
                  />
                )}
              />
            </Box>
          </Grid> */}

          <Grid item xs={2.4}>
            <FormControl fullWidth className='filterFormAutoCompleteV2'>
              <Controller
                control={control}
                name='search'
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputLabel htmlFor='icons-adornment-password'>
                      Search Pros
                    </InputLabel>
                    <OutlinedInput
                      label={'Search Pros'}
                      value={value}
                      id='icons-adornment-password'
                      onFocus={onFocusSearchInput}
                      onBlur={() => setOnFocused(false)}
                      onChange={onChange}
                      sx={{
                        height: '46px',
                      }}
                      inputProps={{
                        style: {
                          height: '46px',
                          padding: '0 14px',
                        },
                      }}
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
          <Grid item xs={12} sm={12} md={2.4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '40px',
                gap: '16px',
              }}
            >
              <Button
                variant='outlined'
                color='secondary'
                type='button'
                onClick={onClickResetButton}
                sx={{ flex: 1 }}
              >
                Reset
              </Button>
              <Button
                variant='contained'
                type='submit'
                color='secondary'
                sx={{ flex: 1 }}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Card>
  )
}

export const AutoCompleteComponent = styled(Card)<CardProps>(
  ({ theme, dropdownClose, modal }) => ({
    '& .MuiAutocomplete-inputRoot': {
      height: !dropdownClose && '56px;',
      flexWrap: dropdownClose ? 'wrap;' : 'noWrap;',
    },
  }),
)

export default ProListFilters
