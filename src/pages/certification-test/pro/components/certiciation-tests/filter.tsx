import { ProCertificationTestFilterType } from '@src/types/pro/pro-certification-test'
import { Dispatch, SetStateAction } from 'react'
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'
import { FilterType } from '.'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  TextField,
} from '@mui/material'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { JobList } from '@src/shared/const/job/jobs'
import _ from 'lodash'

type Props = {
  handleSubmit: UseFormHandleSubmit<FilterType>
  onReset: () => void
  control: Control<FilterType, any>
  trigger: UseFormTrigger<FilterType>
  listCount: number
  onSubmit: (data: FilterType) => void
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

const Filter = ({
  // filter,
  // setFilter,
  handleSubmit,
  onReset,
  control,
  listCount,
  onSubmit,
  setJobTypeOptions,
  setRoleOptions,
  jobTypeOptions,
  roleOptions,
  languageList,
  trigger,
}: Props) => {
  return (
    <Card
      sx={{
        // boxShadow: '0px 0px 10px 0px rgba(76, 78, 100, 0.22)',
        boxShadow: 'none',
        borderBottomLeftRadius: 'inherit',
        borderBottomRightRadius: 'inherit',
        borderBottom: '1px solid rgba(76, 78, 100, 0.22)',
      }}
    >
      <CardHeader title={`Certification tests (${listCount ?? 0})`} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} rowSpacing={4} sx={{ padding: '0' }}>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='jobType'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    // onClose={() => {
                    //   setInputStyle(false)
                    // }}
                    // onOpen={() => {
                    //   setInputStyle(true)
                    // }}
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

                          const res = OnboardingListRolePair.filter(value =>
                            value.jobType.includes(jobTypeValue),
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
                    limitTags={2}
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
                    // onClose={() => {
                    //   setInputStyle(false)
                    // }}
                    // onOpen={() => {
                    //   setInputStyle(true)
                    // }}
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
                    limitTags={2}
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
            <Grid item xs={6}>
              <Controller
                control={control}
                name='sourceLanguage'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    // onClose={() => {
                    //   setInputStyle(false)
                    // }}
                    // onOpen={() => {
                    //   setInputStyle(true)
                    // }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    disableCloseOnSelect
                    limitTags={2}
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
            <Grid item xs={6}>
              <Controller
                control={control}
                name='targetLanguage'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    // onClose={() => {
                    //   setInputStyle(false)
                    // }}
                    // onOpen={() => {
                    //   setInputStyle(true)
                    // }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    disableCloseOnSelect
                    limitTags={2}
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
            <Grid item xs={12}>
              <Box display='flex' justifyContent='flex-end' gap='15px'>
                <Button
                  variant='outlined'
                  size='medium'
                  color='secondary'
                  type='button'
                  onClick={onReset}
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
      </CardContent>
    </Card>
  )
}

export default Filter
