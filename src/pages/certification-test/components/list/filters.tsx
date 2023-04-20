import {
  Accordion,
  AccordionSummary,
  Card,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'
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

import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { JobList } from 'src/shared/const/job/jobs'

import { useState, Dispatch, SetStateAction, SyntheticEvent } from 'react'
import _ from 'lodash'

import { styled } from '@mui/material/styles'

import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import {
  TestMaterialFilterType,
  TestType,
} from 'src/types/certification-test/list'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'

export type CardProps = {
  dropdownClose: boolean
}

type Props = {
  control: Control<TestMaterialFilterType, any>
  handleSubmit: UseFormHandleSubmit<TestMaterialFilterType>
  onSubmit: (data: TestMaterialFilterType) => void
  onClickResetButton: () => void
  trigger: UseFormTrigger<TestMaterialFilterType>
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
}

export default function TestMaterialFilters({
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
  handleFilterStateChange,
  expanded,
}: Props) {
  const [inputStyle, setInputStyle] = useState<boolean>(true)
  const [onFocused, setOnFocused] = useState<boolean>(false)

  const onFocusSearchInput = () => {
    setOnFocused(true)
  }

  return (
    <>
      <Grid item xs={12}>
        <Card>
          {' '}
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleFilterStateChange('panel1')}
          >
            <AccordionSummary
              id='controlled-panel-header-1'
              aria-controls='controlled-panel-content-1'
              sx={{
                borderRadius: '10px',
                backgroundColor: '#fff',

                height: '82px',
              }}
              expandIcon={<Icon icon='mdi:chevron-down' fontSize='24px' />}
            >
              <Typography variant='h6'>
                Search Filters {expanded !== 'panel1' && '(5)'}
              </Typography>
            </AccordionSummary>
            <AutoCompleteComponent
              dropdownClose={inputStyle}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '0px 0px 10px 10px',
                boxShadow: 'none',
                paddingTop: 3,
              }}
            >
              {/* <Typography variant='h6'>Search Filters</Typography> */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  xs={12}
                  spacing={6}
                  rowSpacing={4}
                  sx={{ padding: '0 20px 20px' }}
                >
                  <Grid item xs={4}>
                    <Controller
                      control={control}
                      name='testType'
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
                          }}
                          value={value}
                          disableCloseOnSelect
                          limitTags={1}
                          options={TestType}
                          id='testType'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField {...params} label='Test type' />
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
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
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
                          id='target'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField {...params} label='Target' />
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

                            if (item.length) {
                              const arr: {
                                label: string
                                value: string
                                jobType: string[]
                              }[] = []
                              item.map((data, idx) => {
                                const jobTypeValue = data?.value

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
                  <Grid item xs={6}>
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
              </form>
            </AutoCompleteComponent>
          </Accordion>
        </Card>
      </Grid>
    </>
  )
}

export const AutoCompleteComponent = styled(Card)<CardProps>(
  ({ theme, dropdownClose }) => ({
    '& .MuiAutocomplete-inputRoot': {
      height: !dropdownClose && '56px;',
      flexWrap: dropdownClose ? 'wrap;' : 'noWrap;',
    },
  }),
)
